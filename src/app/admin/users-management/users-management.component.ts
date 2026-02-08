import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user-service';
import { UserResponseDTO } from '../../models/user-response-dto';
import { AyuntamientoService } from '../../services/ayuntamiento-service';
import { Ayuntamiento } from '../../models/ayuntamiento.model';

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-management.component.html',
  styleUrls: ['../management-styles.css']
})
export class UsersManagementComponent implements OnInit {
  users: UserResponseDTO[] = [];
  ayuntamientos: Ayuntamiento[] = [];

  showForm = false;
  isEditing = false;
  searchTerm = '';

  @Output() userChange = new EventEmitter<void>();

  selectedUser: any = {
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    password: '',
    role: 'CLIENTE',
    ayuntamientoId: null
  };

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private ayuntamientoService: AyuntamientoService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
    this.loadAyuntamientos();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando usuarios:', err)
    });
  }

  loadAyuntamientos(): void {
    this.ayuntamientoService.getAyuntamientos().subscribe({
      next: (data) => {
        this.ayuntamientos = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando ayuntamientos:', err)
    });
  }

openForm(user?: UserResponseDTO): void {
    if (user) {
      this.isEditing = true;
      // Mapeamos los datos que vienen de la tabla al formulario
      this.selectedUser = { 
        ...user, 
        password: '', // No mostramos la contraseña al editar
        ayuntamientoId: user.ayuntamientoId 
      };
    } else {
      this.isEditing = false;
      this.selectedUser = {
        nombre: '',
        apellidos: '',
        email: '',
        telefono: '',
        direccion: '',
        password: '',
        role: 'CLIENTE',
        ayuntamientoId: null
      };
    }
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

saveUser(): void {
    const payload = {
      nombre: this.selectedUser.nombre,
      apellidos: this.selectedUser.apellidos,
      email: this.selectedUser.email,
      telefono: this.selectedUser.telefono,
      direccion: this.selectedUser.direccion,
      role: this.selectedUser.role,
      ayuntamientoId: this.selectedUser.ayuntamientoId, // Enviamos el ID plano
      password: this.selectedUser.password // Solo se enviará si se rellena
    };
    
    if (this.isEditing && this.selectedUser.id) {
        this.userService.updateUser(this.selectedUser.id, payload).subscribe({
            next: () => {
                this.loadUsers();
                this.userChange.emit();
                this.closeForm();
            },
            error: (e) => console.error(e)
        });
    } else {
        this.userService.createUser(payload).subscribe({
            next: () => {
                this.loadUsers();
                this.userChange.emit();
                this.closeForm();
            },
            error: (e) => console.error(e)
        });
    }
  }

  deleteUser(id?: number): void {
    if (id && confirm('¿Eliminar usuario?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers();
          this.userChange.emit();
        }
      });
    }
  }

  get filteredUsers(): UserResponseDTO[] {
    const searchTerm = this.searchTerm.toLowerCase();
    return this.users.filter(u =>
      (u.nombre && u.nombre.toLowerCase().includes(searchTerm)) ||
      (u.email && u.email.toLowerCase().includes(searchTerm))
    );
  }
}
