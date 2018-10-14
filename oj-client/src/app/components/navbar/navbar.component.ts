import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { InputService } from '../../services/input.service';
import { debounceTime} from 'rxjs/operators'
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
	title = "COJ";

	searchBox: FormControl = new FormControl();
	subscription: Subscription;



  constructor(private input: InputService, private router: Router) {}


  ngOnInit() {
  	this.subscription = this.searchBox
  							.valueChanges
  							.pipe(debounceTime(200))
  							.subscribe(
  								term => {
  									this.input.changeInput(term);
  							});
  }

}
