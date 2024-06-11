package com.TorneosExpress.dto;

public class ShortPlayerDto {
    private Long id;
    private String name;

    public ShortPlayerDto(Long id, String name){
        this.id = id;
        this.name = name;
    }

    public Long getId(){
        return id;
    }
    public String getName(){
        return name;
    }

    public Long setId(Long id){
        return id;
    }

    public String setName(String name){
        return name;
    }
}
