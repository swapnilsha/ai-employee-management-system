package com.swapnil.employee.management.controller;

import com.swapnil.employee.management.service.AiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/ask")
    public ResponseEntity<?> askAi(
            @RequestBody Map<String, String> request) {

        try {

            String question = request.get("question");

            if (question == null || question.trim().isEmpty()) {
                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "error",
                                        "Question cannot be empty"
                                )
                        );
            }

            String answer =
                    aiService.askAi(question);

            return ResponseEntity.ok(
                    Map.of(
                            "answer",
                            answer
                    )
            );

        } catch (Exception e) {

            // Print complete error in IntelliJ console
            e.printStackTrace();

            return ResponseEntity
                    .status(500)
                    .body(
                            Map.of(
                                    "error",
                                    e.getClass().getSimpleName(),

                                    "message",
                                    String.valueOf(
                                            e.getMessage()
                                    )
                            )
                    );
        }
    }
}