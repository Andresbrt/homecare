package com.cleanhome.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ConfigService {

    private boolean aiEnabled;
    private String aiModel;

    public ConfigService(
            @Value("${ai.enabled:true}") boolean aiEnabled,
            @Value("${ai.model:gpt-5.1-codex-max}") String aiModel
    ) {
        this.aiEnabled = aiEnabled;
        this.aiModel = aiModel;
    }

    public boolean isAiEnabled() {
        return aiEnabled;
    }

    public String getAiModel() {
        return aiModel;
    }

    // Permite actualizar en runtime (admin toggle)
    public void setAiEnabled(boolean enabled) {
        this.aiEnabled = enabled;
    }

    public void setAiModel(String model) {
        this.aiModel = model;
    }
}
