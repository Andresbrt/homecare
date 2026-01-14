package com.cleanhome.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class DevController {
    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }
}
