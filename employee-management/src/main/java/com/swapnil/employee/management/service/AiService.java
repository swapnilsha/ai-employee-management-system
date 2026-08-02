package com.swapnil.employee.management.service;

import com.swapnil.employee.management.entity.Employee;
import com.swapnil.employee.management.repository.EmployeeRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;


import java.util.List;
import java.util.Map;

@Service
public class AiService {

    private final String geminiApiKey;
    private final RestClient restClient;
    private final EmployeeRepository employeeRepository;

    public AiService(
            @Value("${gemini.api.key}") String geminiApiKey,
            EmployeeRepository employeeRepository) {

        this.geminiApiKey = geminiApiKey;
        this.employeeRepository = employeeRepository;
        this.restClient = RestClient.create();
    }


    public String askAi(String question) {

        // 1. Get employees from SQL Server
        List<Employee> employees =
                employeeRepository.findAll();


        // 2. Convert employee information into text
        StringBuilder employeeData = new StringBuilder();

        for (Employee employee : employees) {

            employeeData.append("Employee ID: ")
                    .append(employee.getId())
                    .append("\n");

            employeeData.append("Name: ")
                    .append(employee.getFirstName())
                    .append(" ")
                    .append(employee.getLastName())
                    .append("\n");

            employeeData.append("Email: ")
                    .append(employee.getEmail())
                    .append("\n");

            employeeData.append("Phone: ")
                    .append(employee.getPhone())
                    .append("\n");

            employeeData.append("Designation: ")
                    .append(employee.getDesignation())
                    .append("\n");

            employeeData.append("Salary: ")
                    .append(employee.getSalary())
                    .append("\n");

            employeeData.append("--------------------\n");
        }


        // 3. Give Gemini employee data + user's question
        String prompt = """
                You are an AI assistant for an Employee Management System.

                Answer questions about employees using ONLY the employee
                data provided below.

                If the answer cannot be determined from the employee data,
                say that the information is not available.

                EMPLOYEE DATA:
                %s

                USER QUESTION:
                %s

                Give a clear and concise answer.
                """.formatted(
                employeeData.toString(),
                question
        );


        // 4. Gemini API URL
        String url =
                "https://generativelanguage.googleapis.com/v1beta/models/"
                        + "gemini-3.6-flash:generateContent"
                        + "?key=" + geminiApiKey;


        // 5. Create request body
        Map<String, Object> body = Map.of(
                "contents",
                List.of(
                        Map.of(
                                "parts",
                                List.of(
                                        Map.of(
                                                "text",
                                                prompt
                                        )
                                )
                        )
                )
        );


        // 6. Send request to Gemini
        Map response = restClient
                .post()
                .uri(url)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(Map.class);


        if (response == null) {
            return "No response received from AI.";
        }


        // 7. Extract Gemini answer
        List<Map<String, Object>> candidates =
                (List<Map<String, Object>>)
                        response.get("candidates");

        if (candidates == null ||
                candidates.isEmpty()) {

            return "AI did not return an answer.";
        }


        Map<String, Object> content =
                (Map<String, Object>)
                        candidates
                                .get(0)
                                .get("content");


        List<Map<String, Object>> parts =
                (List<Map<String, Object>>)
                        content.get("parts");


        if (parts == null ||
                parts.isEmpty()) {

            return "AI did not return an answer.";
        }


        return String.valueOf(
                parts.get(0).get("text")
        );
    }
}