package ponto.eletronico.desafio_eliel.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "tb_funcionarios")
public class FuncionarioModel {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long Id;
    private String nome;
    private int HoraEntrada;
    private int MinutosEntrada;
    private int SegundosEntrada;

    public Long getId() {
        return Id;
    }
    @Column(name = "nome")
    public String getNome() {
        return nome;
    }
    @Column(name = "Horário de Entrada")
    public int getHoraEntrada() {
        return HoraEntrada;
    }
    @Column(name = "Minutos de Entrada")
    public int getMinutosEntrada() {
        return MinutosEntrada;
    }
    @Column(name = "Segundos De entrada")
    public int getSegundosEntrada() {
        return SegundosEntrada;
    }


    public void setNome(String nome) {
        this.nome = nome;
    }
    public void setHoraEntrada(int horaEntrada) {
        this.HoraEntrada = horaEntrada;
    }
    public void setMinutosEntrada(int minutosEntrada) {
        this.MinutosEntrada = minutosEntrada;
    }
    public void setSegundosEntrada(int segundosEntrada) {
        this.SegundosEntrada = segundosEntrada;
    }



}
