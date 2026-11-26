package com.example.employeeonboarding.exception;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import tools.jackson.databind.exc.InvalidFormatException;

@RestControllerAdvice // Listens for exceptions across ALL @RestControllers
public class GlobalExceptionHandler {

    // Handles @Valid failures -> Returns HTTP 400 with field-level messages
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
            fieldErrors.put(error.getField(), error.getDefaultMessage())
        );

        Map<String, Object> body = new HashMap<>();
        body.put("message", "Validation failed");
        body.put("errors", fieldErrors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body); // 400
    }

    // Handles Duplicate Email or Early Step 5 Completion -> Returns HTTP 409
    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<Map<String, String>> handleConflict(ConflictException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT) // 409
                .body(Map.of("message", ex.getMessage()));
    }
    
    public ResponseEntity<Map<String, String>> handleUnreadableMessage(HttpMessageNotReadableException ex) {
    	String message = "Invalid request format. Please check your input values.";
    	
    	if (ex.getCause() instanceof InvalidFormatException invalidEx && invalidEx.getTargetType() == LocalDate.class) {
    		message = "Invalid date '" + invalidEx.getValue() + "'. Please enter a valid calender date in YYYY-MM-DD format.";
    	}
    	
    	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", message));
    }
    
    // HTTP 401: Invalid login credentials
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<Map<String, String>> handleUnauthorized(UnauthorizedException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", ex.getMessage()));
    }

    // Catch-all safety net -> Returns HTTP 500 without leaking internal stack traces
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGenericException(Exception ex) {
    	ex.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "An unexpected server error occurred."));
    }
}