package com.ironhack.moviewatchlist.controller;

import com.ironhack.moviewatchlist.exceptions.NotLoggedInException;
import com.ironhack.moviewatchlist.exceptions.PageNotFoundException;
import com.ironhack.moviewatchlist.exceptions.PageNotPublicException;
import com.ironhack.moviewatchlist.exceptions.UsernameAlreadyExistsException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(PageNotPublicException.class)
    public ResponseEntity<?> handlePageNotPublic(PageNotPublicException ex) {
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(new ErrorResponse("ACCESS_DENIED", ex.getMessage()));
    }

    @ExceptionHandler(PageNotFoundException.class)
    public ResponseEntity<?> handlePageNotFound(Exception ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse("PAGE_NOT_FOUND", ex.getMessage()));
    }

    @ExceptionHandler(NotLoggedInException.class)
    public ResponseEntity<?> handleNotLoggedIn(NotLoggedInException ex) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse("NOT_LOGGED_IN", ex.getMessage()));
    }

    @ExceptionHandler(UsernameAlreadyExistsException.class)
    public ResponseEntity<?> handleUsernameAlreadyExists(UsernameAlreadyExistsException ex) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(new ErrorResponse("USERNAME_ALREADY_EXISTS", ex.getMessage()));
    }

    public static class ErrorResponse {
        private String code;
        private String message;

        public ErrorResponse(String code, String message) {
            this.code = code;
            this.message = message;
        }

        public String getCode() { return code; }
        public String getMessage() { return message; }
    }

}