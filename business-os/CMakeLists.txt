cmake_minimum_required(VERSION 3.16)
project(BusinessOS LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(BusinessOS
    BusinessOS/main.cpp
    src/Application.cpp
    src/InMemoryStore.cpp
    src/ExcelStore.cpp
    src/CustomerRepository.cpp
    src/ProductCatalog.cpp
    src/QuoteRepository.cpp
    src/OrderRepository.cpp
    src/ListCatalog.cpp
    src/QuoteService.cpp
    src/InventoryService.cpp
    src/DashboardService.cpp
)

target_include_directories(BusinessOS PRIVATE include)

# Demo/non-interactive smoke: feed quit after startup dump.
# cmake --build . && printf 'quit\n' | ./BusinessOS
