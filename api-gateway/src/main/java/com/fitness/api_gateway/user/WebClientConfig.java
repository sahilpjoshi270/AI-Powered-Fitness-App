package com.fitness.api_gateway.user;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    @LoadBalanced  // helps resolve the service name via eureka
    public WebClient.Builder webClientBuilder(){
        return WebClient.builder();
    }

    @Bean
    public WebClient userServiceWebClient(WebClient.Builder webClientBuilder){
        return webClientBuilder
                .baseUrl("http://user-Service")
                .build();
    }




}
