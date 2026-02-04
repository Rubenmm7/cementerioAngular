import { Component } from '@angular/core';
import { Navbar } from "../../landing/navbar/navbar";
import { Header } from "../../landing/header/header";
import { About } from "../../landing/about/about";
import { Features } from "../../landing/features/features";
import { Contact } from "../../landing/contact/contact";
import { Footer } from "../../landing/footer/footer";

@Component({
  selector: 'app-landing',
  imports: [Navbar, Header, About, Features, Contact, Footer],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {

}
