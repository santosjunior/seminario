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
    let dias = [];
    let pos = 0;
    let porcentoAnterior = 0;
    for (let i = 0; i <= 100; i = i + (100/this.prazoProjeto)){
      lista.push(i)
    }
    for (let i = 0; i <= this.prazoProjeto; i++){
      prazo.push(i);
    }
    porcento.push(0);
    
    for (let pontos of this.listaPontos){
      if(pontos.dia > porcento.length && porcento.length !== 0){
        console.log('dia '+pontos.dia)
        console.log('tamanho '+porcento.length)
        console.log(porcento[porcento.length-1])
        porcento.push(porcento[porcento.length-1])
      }     
        p = p + pontos.porcento
        console.log('dia = 0 '+p)
        porcento.push(p);
       
         
          for(let dia of dias){
            console.log('dia '+ dia)
            console.log('dias '+ dias)
            console.log('antes do if '+porcento)
            if(dia === pontos.dia && dia != 0){
              console.log('entrou')
              console.log('passando pelo if '+porcento)
              porcentoAnterior = p;              
              pos = porcento.map(elem => elem).indexOf(porcentoAnterior);
              porcento.splice(pos-1, 1);              
              console.log('passou pelo splice '+porcento)              
              console.log('terminou o if '+porcento)
            }            
            
          }
          if(dias.indexOf(pontos.dia) < 0){
            dias.push(pontos.dia);
          }
          
                
             
      
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
        borderColor: 'rgba(63,191,84,0.85)',
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
    const atualizarAtividade = new Atividade();
    atualizarAtividade.nome = atividade.nome;
    atualizarAtividade.importancia = atividade.importancia;
    atualizarAtividade.concluida = true;
    this.ativarConclusao = true;
    this.atividade = atividade
    const pos = this.atividades.map(elem => elem.nome).indexOf(atividade.nome);
    this.atividades.splice(pos, 1);
    this.atividades.push(atualizarAtividade);
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
