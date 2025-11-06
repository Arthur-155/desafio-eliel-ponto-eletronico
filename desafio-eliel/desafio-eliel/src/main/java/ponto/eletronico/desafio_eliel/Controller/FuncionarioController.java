package ponto.eletronico.desafio_eliel.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import ponto.eletronico.desafio_eliel.Model.FuncionarioModel;
import ponto.eletronico.desafio_eliel.Service.FuncionarioService;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/funcionarios")
public class FuncionarioController {

    @Autowired
    private FuncionarioService funcionarioService;


    @GetMapping
    public List<FuncionarioModel> buscarFuncionarios() {
        return funcionarioService.listarFuncionarios();
    }

    @PostMapping
    public FuncionarioModel criarFuncionario(@RequestBody FuncionarioModel funcionario) {
        return funcionarioService.criarFuncionario(funcionario);
    }

    @PutMapping("/{id}")
    public FuncionarioModel atualizarFuncionario(
            @PathVariable Long id,
            @RequestBody FuncionarioModel dados) {
        return funcionarioService.atualizarFuncionario(id, dados);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletarFuncionario(@PathVariable Long id) {
        funcionarioService.deletarFuncionario(id);
    }

}
