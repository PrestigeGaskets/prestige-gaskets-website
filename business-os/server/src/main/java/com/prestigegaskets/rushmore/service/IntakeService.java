package com.prestigegaskets.rushmore.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import org.springframework.stereotype.Service;

/** Applies staged intake actions onto a working-copy master document. */
@Service
public class IntakeService {

  private final ObjectMapper mapper;

  public IntakeService(ObjectMapper mapper) {
    this.mapper = mapper;
  }

  public ObjectNode applyAll(ObjectNode master, ArrayNode pending, String actor) {
    if (pending == null) {
      return master;
    }
    for (JsonNode entry : pending) {
      String type = text(entry, "type");
      switch (type) {
        case "accept-quote" -> acceptQuote(master, entry);
        case "receive-po" -> receivePo(master, entry, actor);
        case "post-shipment" -> postShipment(master, entry);
        case "unpost-shipment" -> unpostShipment(master, entry);
        default -> {
          /* working-copy-edits already reflected in client patch */
        }
      }
    }
    return master;
  }

  private void acceptQuote(ObjectNode master, JsonNode entry) {
    String quoteNo = text(entry, "quoteNo");
    ArrayNode quotes = array(master, "quotes");
    ObjectNode quote = findBy(quotes, "quoteNo", quoteNo);
    if (quote == null) {
      throw new IllegalArgumentException("Unknown quote " + quoteNo);
    }
    ArrayNode orders = array(master, "orders");
    for (JsonNode o : orders) {
      if (quoteNo.equals(text(o, "quoteNo"))) {
        return;
      }
    }
    String orderNo = "O-" + (500 + orders.size());
    ObjectNode order = mapper.createObjectNode();
    order.put("orderNo", orderNo);
    order.put("quoteNo", quoteNo);
    order.put("customerId", text(quote, "customerId"));
    order.put("status", "Open");
    order.put("readyToPrint", true);
    order.put("shipMethod", text(quote, "shipMethod"));
    order.put("via", text(quote, "via"));
    order.put(
        "shipPaymentType",
        "COLLECT".equalsIgnoreCase(text(quote, "shipMethod")) ? "COLLECT" : "PREPAID");
    order.set(
        "lines",
        quote.get("lines") == null ? mapper.createArrayNode() : quote.get("lines").deepCopy());
    orders.add(order);
    quote.put("status", "Won");
    patch(entry, "orderNo", orderNo);
    patch(entry, "customerId", text(quote, "customerId"));
    patch(entry, "detail", "Accept " + quoteNo + " → " + orderNo);
  }

  private void receivePo(ObjectNode master, JsonNode entry, String actor) {
    String poNo = text(entry, "poNo");
    ArrayNode pos = array(master, "purchaseOrders");
    ObjectNode po = findBy(pos, "poNo", poNo);
    if (po == null) {
      throw new IllegalArgumentException("Unknown PO " + poNo);
    }
    ArrayNode receipts = array(master, "goodsReceipts");
    String grnNo = "GRN-" + (1000 + receipts.size());
    ObjectNode grn = mapper.createObjectNode();
    grn.put("grnNo", grnNo);
    grn.put("poNo", poNo);
    grn.put("supplierId", text(po, "supplierId"));
    grn.put(
        "receivedDate",
        LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy", Locale.UK)));
    grn.put("receivedBy", actor);
    grn.put("status", "Posted");
    grn.put("notes", "Goods received against PO " + poNo);
    ArrayNode lines = mapper.createArrayNode();
    ArrayNode products = array(master, "products");
    if (po.get("lines") != null) {
      int i = 1;
      for (JsonNode pl : po.get("lines")) {
        ObjectNode line = mapper.createObjectNode();
        line.put("line", i++);
        line.put("poNo", poNo);
        line.put("poLine", pl.path("line").asInt());
        line.put("sku", text(pl, "sku"));
        double qty = pl.path("qty").asDouble(0);
        line.put("qtyOrdered", qty);
        line.put("qtyReceived", qty);
        lines.add(line);
        ObjectNode product = findBy(products, "sku", text(pl, "sku"));
        if (product != null) {
          product.put("onHand", product.path("onHand").asDouble(0) + qty);
        }
      }
    }
    grn.set("lines", lines);
    receipts.add(grn);
    po.put("status", "Closed");
    patch(entry, "grnNo", grnNo);
    patch(entry, "detail", "Receive " + poNo + " → " + grnNo);
  }

  private void postShipment(ObjectNode master, JsonNode entry) {
    String shipmentId = first(entry, "shipmentId", "shipmentNo");
    ObjectNode ship = findShipment(master, shipmentId);
    if (ship == null) {
      throw new IllegalArgumentException("Unknown shipment " + shipmentId);
    }
    ArrayNode products = array(master, "products");
    if (ship.get("lines") != null) {
      for (JsonNode line : ship.get("lines")) {
        if (!line.path("marked").asBoolean(true)) {
          continue;
        }
        double qty = line.path("qtyShipped").asDouble(line.path("deliveryQty").asDouble(0));
        ObjectNode product = findBy(products, "sku", text(line, "sku"));
        if (product != null) {
          product.put("onHand", Math.max(0, product.path("onHand").asDouble(0) - qty));
        }
      }
    }
    ship.put("status", "Posted");
    if (!ship.path("deliveryNoteIssued").asBoolean(false)) {
      ship.put("deliveryNoteIssued", true);
      if (text(ship, "deliveryNoteNo").isBlank()) {
        ship.put("deliveryNoteNo", "DN-" + shipmentId);
      }
    }
    patch(entry, "detail", "Ship " + shipmentId + " posted · OH issued");
  }

  private void unpostShipment(ObjectNode master, JsonNode entry) {
    String shipmentId = first(entry, "shipmentId", "shipmentNo");
    ObjectNode ship = findShipment(master, shipmentId);
    if (ship == null) {
      throw new IllegalArgumentException("Unknown shipment " + shipmentId);
    }
    ArrayNode products = array(master, "products");
    if (ship.get("lines") != null) {
      for (JsonNode line : ship.get("lines")) {
        double qty = line.path("qtyShipped").asDouble(line.path("deliveryQty").asDouble(0));
        ObjectNode product = findBy(products, "sku", text(line, "sku"));
        if (product != null) {
          product.put("onHand", product.path("onHand").asDouble(0) + qty);
        }
      }
    }
    ship.put("status", "Open");
    patch(entry, "detail", "Unpost " + shipmentId + " · OH restored");
  }

  private ObjectNode findShipment(ObjectNode master, String shipmentId) {
    ArrayNode shipments = array(master, "shipments");
    ObjectNode ship = findBy(shipments, "shipmentId", shipmentId);
    if (ship == null) {
      ship = findBy(shipments, "shipmentNo", shipmentId);
    }
    return ship;
  }

  private static void patch(JsonNode entry, String field, String value) {
    if (entry instanceof ObjectNode on) {
      on.put(field, value);
    }
  }

  private ArrayNode array(ObjectNode master, String field) {
    JsonNode n = master.get(field);
    if (n instanceof ArrayNode an) {
      return an;
    }
    return master.putArray(field);
  }

  private static ObjectNode findBy(ArrayNode arr, String field, String value) {
    if (value == null || value.isBlank()) {
      return null;
    }
    for (JsonNode n : arr) {
      if (value.equals(text(n, field)) && n instanceof ObjectNode on) {
        return on;
      }
    }
    return null;
  }

  private static String text(JsonNode n, String field) {
    JsonNode v = n.get(field);
    return v == null || v.isNull() ? "" : v.asText("");
  }

  private static String first(JsonNode n, String... fields) {
    for (String f : fields) {
      String v = text(n, f);
      if (!v.isBlank()) {
        return v;
      }
    }
    return "";
  }

  public static String businessDay() {
    return LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);
  }
}
