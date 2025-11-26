import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../model/user.model';
import { ImageUploadService } from '../../../shared/services/image-upload.service';
import { AuthService } from '../../../auth/services/auth.service';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  profileForm!: FormGroup;
  loading = true;
  imagePreview: string | null = null;
  currentUser!: User;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private imageUpload: ImageUploadService
  ) {}

ngOnInit(): void {
  this.authService.currentUser$.subscribe((user) => {
    if (!user) return;

    this.currentUser = user;
    this.imagePreview = user.photoURL || null;

    this.profileForm = this.fb.group({
      name: [user.name || ''],
      lastname: [user.lastname || ''],
      email: [{ value: user.email, disabled: true }],
      birthdate: [user.birthdate || null],
      address: [user.address || ''],
      phone: [user.phone || ''],
    });

    this.loading = false;
  });
}

  async onPhotoSelect(event: any): Promise<void> {
    const file: File = event.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    this.imagePreview = localPreview;

    const path = `users/${this.currentUser.uid}/profile.jpg`;
    const downloadURL = await this.imageUpload.uploadImage(file, path);

    await this.userService.updateUser(this.currentUser.uid, {
      photoURL: downloadURL,
    });
  }

  async save(): Promise<void> {
    if (!this.currentUser) return;

    const data = this.profileForm.getRawValue();

    await this.userService.updateUser(this.currentUser.uid, {
      name: data.name,
      lastname: data.lastname,
      address: data.address,
      phone: data.phone,
      birthdate: data.birthdate || null,
    });
  }
}
