package com.cleanhome.backend.controller;

import com.cleanhome.backend.service.PaymentService;
import com.cleanhome.backend.service.WompiService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
@TestPropertySource(properties = {
        "ai.enabled=true",
    "ai.model=gpt-5.1-codex-max",
    "wompi.public-key=dummy",
    "wompi.private-key=dummy",
    "wompi.api-base=https://example.com",
    "wompi.events-secret=dummy"
})
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class ConfigControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PaymentService paymentService;

    @MockBean
    private WompiService wompiService;

    @Test
    void getAiConfig_public_shouldReturn200() throws Exception {
        mockMvc.perform(get("/api/config/ai"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.model").value("gpt-5.1-codex-max"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void putAiConfig_admin_shouldSucceed() throws Exception {
        Map<String, Object> body = new HashMap<>();
        body.put("enabled", false);
        body.put("model", "gpt-4.2-mini");

        mockMvc.perform(put("/api/config/ai")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.enabled").value(false))
                .andExpect(jsonPath("$.model").value("gpt-4.2-mini"));
    }

    @Test
    @WithMockUser(roles = "CUSTOMER")
    void putAiConfig_nonAdmin_shouldBeForbidden() throws Exception {
        Map<String, Object> body = new HashMap<>();
        body.put("enabled", false);

        mockMvc.perform(put("/api/config/ai")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isForbidden());
    }
}
