package model;


import javax.persistence.*;

@Entity
public class Sport {
    public Sport(){}

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long sport_id;
    @Column
    private String sportName;

    @Column
    private int num_players;

    public void setSport(String sportName){
        this.sportName = sportName;
    }

    public void setNumPlayers(int num_players){
        this.num_players = num_players;
    }

    public String toString() {
        return sportName;
    }

}
