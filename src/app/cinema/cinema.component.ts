import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CinemaService} from "../services/cinema.service";

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {

  public villes:any;
  public cinemas:any;
  public salles:any;
  public currentVille:any;
  public  currentCinema:any;
  public currentProjection: any;
  public selectedTickets: any;

  constructor(public cinemaService: CinemaService) { }

  ngOnInit(){
    this.cinemaService.getVilles()
    .subscribe(data=>{
      this.villes=data;
    },error => {
      console.log(error);
    })
  }

  onGetCinema(v:any) {
    this.currentVille=v;
    this.salles=undefined;
    this.cinemaService.getCinemas(v)
      .subscribe(data=>{
        this.cinemas=data;
      },error => {
        console.log(error);
      })
  }

  onGetSalles(c:any) {
    this.currentCinema=c;
    this.cinemaService.getSalles(c)
      .subscribe(data=>{
        this.salles=data;
        this.salles._embedded.salles.forEach((salle:any)=>{
          this.cinemaService.getProjections(salle)
            .subscribe(data=>{
              salle.projections=data;
            },error => {
              console.log(error);
            })
        })
      },error => {
        console.log(error);
      })
  }

  onGetTicketsPlaces(p:any) {
    this.currentProjection = p;
    this.cinemaService.getTicketsPlaces(p)
      .subscribe(data=>{
        this.currentProjection.tickets=data;
        this.selectedTickets=[];
      },error=> {
        console.log(error);
      })
  }

  onSelectTicket(t:any) {
    if(!t.selected){
      t.selected=true;
      this.selectedTickets.push(t);
    }else{
      t.selected=false;
      this.selectedTickets.slice(this.selectedTickets.indexOf(t),1);
    }
    console.log(this.selectedTickets);
  }

  getTicketClass(t:any) {
    let str="btn ";
    if(t.reserve==true){
      str+="btn-danger"
    }else if(t.selected){
      str +="btn-warning";
    }else {
      str+="btn-sucess"
    }
    return str;
  }

  onPayTickets(dataForm:any) {
    let tickets: any[]=[];
    this.selectedTickets.forEach((t:any)=>{
      tickets.push(t.id);
    });
    dataForm.tickets=tickets;
    console.log(dataForm);
    this.cinemaService.payerTickets(dataForm)
      .subscribe(data=>{
        alert("Tickets reserve avec succes");
        this.onGetTicketsPlaces(this.currentProjection);
      },error=> {
        console.log(error);
      })
  }
}
