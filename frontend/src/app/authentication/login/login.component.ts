import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { routes } from 'src/app/shared/routes/routes';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public routes = routes;
  public passwordClass = false;
  public ERROR = false;
  public loading = false;

  form = new FormGroup({
    email: new FormControl('herreraramon2001@gmail.com', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('12345678', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  constructor(
    public auth: AuthService,
    public router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('authenticated')) {
      localStorage.removeItem('authenticated');
    }
  }

  loginFormSubmit() {
    if (this.form.valid) {
      this.ERROR = false;
      this.loading = true; // Iniciar la animación de carga
      this.spinner.show(); // Mostrar spinner de carga
      this.auth
        .login(
          this.form.value.email ? this.form.value.email : '',
          this.form.value.password ? this.form.value.password : ''
        )
        .subscribe(
          (resp: any) => {
            if (resp) {
              // El login es exitoso
              setTimeout(() => {
                this.spinner.hide(); // Oculta el spinner
                this.loading = false;
                this.router.navigate([this.routes.adminDashboard]);
              }, 1000); // Opcional: pequeño retraso para mejor UX
            } else {
              // El login no es exitoso
              this.ERROR = true;
              this.loading = false;
              this.spinner.hide(); // Ocultar el spinner
            }
          },
          (error) => {
            this.ERROR = true;
            this.loading = false;
            this.spinner.hide(); // Ocultar el spinner en caso de error
            console.error(error);
          }
        );
    }
  }

  togglePassword() {
    this.passwordClass = !this.passwordClass;
  }
}
