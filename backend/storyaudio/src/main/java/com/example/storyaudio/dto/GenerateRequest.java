package com.example.storyaudio.dto;

import lombok.Data;

// @Data generates all the boilerplate for a plain Java object:
// getters, setters, required-args-constructor, toString, equals, and hashCode.
@Data
public class GenerateRequest {
    private String prompt;
}
