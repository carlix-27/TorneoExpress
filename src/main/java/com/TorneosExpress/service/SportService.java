package com.TorneosExpress.service;


import com.TorneosExpress.model.Sport;
import com.TorneosExpress.repository.SportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class SportService {

    @Autowired
    private SportRepository sportRepository;

    public Optional<Sport> getSportById(Long sportId) {
        return sportRepository.findById(sportId);
    }
    public List<Sport> getAllSports() {
        return sportRepository.findAll();
    }

    public Sport createSport(String sportName, int num_players) {
        Sport sport = new Sport();
        sport.setSport(sportName);
        sport.setNumPlayers(num_players);
        return sportRepository.save(sport);
    }

    public void deleteSport(Long sportId) {
        sportRepository.deleteById(sportId);
    }

    public Sport updateSport(Long sportId, String new_name, int num_players) {
        Optional<Sport> optionalSport = sportRepository.findById(sportId);
        if (optionalSport.isPresent()) {
            Sport sport = optionalSport.get();
            sport.setSport(new_name);
            sport.setNumPlayers(num_players);
            return sportRepository.save(sport);
        } else {
            // Manejo de caso en que no se encuentra el deporte con el ID dado
            throw new NoSuchElementException("No se encontró el deporte con ID: " + sportId);
        }
    }
}