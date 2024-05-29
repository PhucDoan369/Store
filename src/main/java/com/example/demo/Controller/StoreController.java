package com.example.demo.Controller;

import com.example.demo.Item.CartItem;
import com.example.demo.Item.Product;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class StoreController {

    private List<Product> products = new ArrayList<>();
    private Map<Integer, CartItem> cart = new HashMap<>();

    public StoreController() {
        // Thêm một vài sản phẩm mẫu
        products.add(new Product(1, "Sản phẩm A", "Mô tả sản phẩm A", 100.0));
        products.add(new Product(2, "Sản phẩm B", "Mô tả sản phẩm B", 150.0));
        products.add(new Product(3, "Sản phẩm C", "Mô tả sản phẩm C", 200.0));
    }

    @GetMapping("/store")
    public String viewStore(Model model) {
        model.addAttribute("products", products);
        return "store";
    }

    @PostMapping("/add-to-cart/{id}")
    @ResponseBody
    public Map<String, String> addToCart(@PathVariable int id, @RequestParam int quantity) {
        Map<String, String> response = new HashMap<>();
        Product product = products.stream()
                .filter(p -> p.getId() == id)
                .findFirst()
                .orElse(null);

        if (product != null) {
            CartItem cartItem = cart.getOrDefault(id, new CartItem(product, 0));
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
            cart.put(id, cartItem);
            response.put("message", "Đã thêm " + product.getName() + " vào giỏ hàng!");
        } else {
            response.put("message", "Sản phẩm không tồn tại!");
        }

        return response;
    }

    @GetMapping("/order/{id}")
    public String orderProduct(@PathVariable int id, @RequestParam int quantity, Model model) {
        Product product = products.stream()
                .filter(p -> p.getId() == id)
                .findFirst()
                .orElse(null);

        if (product != null) {
            model.addAttribute("product", product);
            model.addAttribute("quantity", quantity);
            return "order";
        } else {
            return "redirect:/store";
        }
    }

    @PostMapping("/submit-order")
    public String submitOrder(@RequestParam String name, @RequestParam String address, @RequestParam String phone, @RequestParam int productId, @RequestParam int quantity, Model model) {
        Product product = products.stream()
                .filter(p -> p.getId() == productId)
                .findFirst()
                .orElse(null);

        if (product != null) {
            // Gửi thông tin đến Telegram
            String message = String.format("Đơn hàng mới:\nTên: %s\nĐịa chỉ: %s\nSố điện thoại: %s\nSản phẩm: %s\nSố lượng: %d", name, address, phone, product.getName(), quantity);
            sendMessageToTelegram(message);

            model.addAttribute("message", "Đặt hàng thành công!");
            return "confirmation";
        } else {
            model.addAttribute("message", "Sản phẩm không tồn tại!");
            return "error";
        }
    }

    private void sendMessageToTelegram(String message) {
        String telegramToken = "YOUR_TELEGRAM_BOT_TOKEN";
        String chatId = "YOUR_CHAT_ID";
        String url = String.format("https://api.telegram.org/bot%s/sendMessage?chat_id=%s&text=%s", telegramToken, chatId, message);

        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getForObject(url, String.class);
    }

    @GetMapping("/cart")
    public String viewCart(Model model) {
        model.addAttribute("cartItems", new ArrayList<>(cart.values()));
        return "cart";
    }

    @PostMapping("/buy")
    public String buyProducts(Model model) {
        cart.clear();
        model.addAttribute("message", "Bạn đã mua hàng thành công!");
        return "buy";
    }
}
