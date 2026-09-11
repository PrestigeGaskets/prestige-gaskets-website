package com.prestigegaskets.rushmore.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Lightweight operator identity: cookie {@code rushmore_employee} or header {@code X-Employee-Id}.
 */
@Component
public class OperatorSessionFilter extends OncePerRequestFilter {

  public static final String COOKIE = "rushmore_employee";
  public static final String HEADER = "X-Employee-Id";
  public static final String ATTR = "rushmore.employeeId";

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    String employeeId = request.getHeader(HEADER);
    if (employeeId == null || employeeId.isBlank()) {
      Cookie[] cookies = request.getCookies();
      if (cookies != null) {
        for (Cookie c : cookies) {
          if (COOKIE.equals(c.getName()) && c.getValue() != null && !c.getValue().isBlank()) {
            employeeId = c.getValue();
            break;
          }
        }
      }
    }
    if (employeeId != null && !employeeId.isBlank()) {
      request.setAttribute(ATTR, employeeId.trim());
    }
    filterChain.doFilter(request, response);
  }

  public static void writeLoginCookie(HttpServletResponse response, String employeeId) {
    Cookie cookie = new Cookie(COOKIE, employeeId);
    cookie.setPath("/");
    cookie.setHttpOnly(true);
    cookie.setMaxAge(60 * 60 * 12);
    response.addCookie(cookie);
  }
}
