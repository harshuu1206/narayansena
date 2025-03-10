package org.uway.NarayanSena.controller;

import org.springframework.http.HttpStatus;
import org.uway.NarayanSena.dto.PaymentDto;
import org.uway.NarayanSena.exception.PaymentNotFoundException;
import org.uway.NarayanSena.services.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.logging.Logger;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {
    private static final Logger logger = Logger.getLogger(PaymentController.class.getName());

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create")
    public ResponseEntity<String> createPayment(@RequestBody PaymentDto paymentDto, @RequestParam long userId) {
        logger.info("Received payment request: " + paymentDto + " for userId: " + userId);
        String paymentResult = paymentService.createPayment(paymentDto, userId);
        return ResponseEntity.ok(paymentResult);
    }

    @PostMapping("/update")
    public ResponseEntity<String> updatePayment(@RequestParam String orderId, @RequestParam String paymentId, @RequestParam String status) {
        try {
            paymentService.updatePayment(orderId, paymentId, status);
            return ResponseEntity.ok("Payment updated successfully.");
        } catch (PaymentNotFoundException ex) {
            logger.warning("Payment not found for orderId: " + orderId + ": " + ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Payment not found.");
        } catch (Exception e) {
            logger.severe("Error during payment update: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Payment update failed.");
        }
    }
}
