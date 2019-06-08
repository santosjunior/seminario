import { Atividade } from './../models/atividade';
import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Projeto } from '../models/projeto';

@Component({
  selector: 'app-grafico',
  templateUrl: './grafico.component.html',
  styleUrls: ['./grafico.component.scss']
})
export class GraficoComponent implements OnInit {
 
   dist = null;
   coefAngular = null;
   nomeProjeto = '';
   prazoProjeto = 0;
   projeto = new Projeto();
   atividades: Atividade[] = [];
   atividade = new Atividade();   
   listaPontos = [];

   //Formularios
   distanciaForm: FormGroup;
   coeficienteForm: FormGroup;
   projetoForm: FormGroup;
   atividadeForm: FormGroup;
   pontosForm: FormGroup;

   //Variáveis de Exibição
   exibirGrafico = false;
   exibirFormProjeto = true;
   exibirFormAtividades = false;
   exibirListaAtividades = false;
   ativarConclusao = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.distanciaForm = this.formBuilder.group({
      x1: '',
      x2: '',
      y1: '',
      y2: ''
    });
    this.coeficienteForm = this.formBuilder.group({
      x1: '',
      x2: '',
      y1: '',
      y2: ''
    });
    this.projetoForm = this.formBuilder.group({
      nome: '',
      prazo: ''
    });
    this.atividadeForm = this.formBuilder.group({
      nome: '',
      importancia: '',
      concluida: ''
    });
    this.pontosForm = this.formBuilder.group({
      //Eixo X
      dia: '',
     
    });

  }

  gerar(){
    this.exibirGrafico = true;
    let lista = [];
    let prazo = [];
    let porcento = [];
    let p = 0;
    for (let i = 0; i <= 100; i = i + (100/this.prazoProjeto)){
      lista.push(i)
    }
    for (let i = 0; i <= this.prazoProjeto; i++){
      prazo.push(i);
    }
    porcento.push(0);
    for (let pontos of this.listaPontos){      
      p = p + pontos.porcento
      porcento.push(p);
    }
    
    const ctx = document.getElementById('grafico');
    const grafico = new Chart(ctx, {
    type: 'line',
    data: {
      labels: prazo,
      datasets: [{
        label: 'Projeção',
        data: lista,
        borderWidth: 6,
        borderColor: 'rgba(77,166,253,0.85)',
        backgroundColor: 'transparent'
      },
      {
        label: 'Estado Atual',
        data: porcento,
        borderWidth: 6,
        borderColor: 'rgba(63,140,191,0.85)',
        backgroundColor: 'transparent'
      }
    ]

    },
    options: {
      title: this.nomeProjeto
    }
  });
  }

  addProjeto(form: any){
    this.nomeProjeto = form.nome;
    this.prazoProjeto = form.prazo;
    this.exibirFormProjeto = false;
    this.exibirFormAtividades = true;
  }

  distancia(form: any){  
    const x1 = Number.parseInt(form.x1);
    const x2 = Number.parseInt(form.x2);
    const y1 = Number.parseInt(form.y1);
    const y2 = Number.parseInt(form.y2);

    this.dist = Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2))
  }

  calcularTangente(angulo: number){
    return Math.tan(angulo);
  }

  coeficienteAngular(form: any){
    const x1 = Number.parseInt(form.x1);
    const x2 = Number.parseInt(form.x2);
    const y1 = Number.parseInt(form.y1);
    const y2 = Number.parseInt(form.y2);

    /*/
    Fórmula
     (yB – yA)/(xB – xA)
    /*/
    this.coefAngular = (y2 - y1) / (x2 - x1)    
  }  

  addAtividade(form: any){
    const atividade = new Atividade();
    atividade.nome = form.nome;
    atividade.importancia = form.importancia;
    atividade.concluida = false;
    
    this.atividades.push(atividade);
    
  } 
  
  ListaAtivi(){
    this.exibirFormAtividades = false;
    this.exibirListaAtividades = true;    
  }

  concluirAtividade(atividade: Atividade){
    this.ativarConclusao = true;
    this.atividade = atividade
  }

  
  addPontos(form: any){
    const pontos = {dia: form.dia, porcento: this.atividade.importancia};
    if((this.listaPontos.length + 1) < pontos.dia ){
      const lista = this.listaPontos;
      for(let i = pontos.dia; i > lista.length; i--){
        this.listaPontos.push({dia: this.listaPontos.length, porcento: 0});
      }
    }
    this.listaPontos.push(pontos);
    this.ativarConclusao = false;    
  }
}
