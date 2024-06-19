package com.example.demo.controller;

import com.example.demo.entity.AppUser;
import com.example.demo.service.AppUserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customized_users")
@Tag(name = "Customized Users", description = "Controllerから自前で作成したAPI")
public class AppUserController {
    @Autowired
    private AppUserService appUserService;

    @GetMapping
    @Operation(summary = "ユーザー一覧取得", description = "App_Userテーブルの情報を全て返します", responses = {
            @ApiResponse(responseCode = "200", description = "200 (OK)", content = {
                    @Content(mediaType = "application/json", array = @ArraySchema(schema = @Schema(implementation = AppUser.class)))
            }),
    })
    public List<AppUser> getAllUsers() {
        return appUserService.getAllUsers();
    }
}