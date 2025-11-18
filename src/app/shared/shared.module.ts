import { NgModule } from '@angular/core';
import { MaterialModule } from './material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BooleanToTextPipe } from './pipes/boolean-to-text.pipe';
import { BooleanStyleDirective } from './directives/boolean-style.directive';
import { UnionNombreApellidoPipe } from './pipes/union-nombre-apellido.pipe';
import { SizeTittleDirective } from './directives/size-tittle.directive';

@NgModule({
  declarations: [
    BooleanToTextPipe,
    UnionNombreApellidoPipe,
    BooleanStyleDirective,
    SizeTittleDirective,
  ],
  imports: [MaterialModule, ReactiveFormsModule],
  exports: [
    MaterialModule,
    ReactiveFormsModule,
    BooleanToTextPipe,
    UnionNombreApellidoPipe,

    SizeTittleDirective,
    BooleanStyleDirective,
  ],
})
export class SharedModule {}
