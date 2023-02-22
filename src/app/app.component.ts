import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { SubscriptionService } from './services/subscription.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [SubscriptionService]

})
export class AppComponent {

  public form!: UntypedFormGroup;
  public errorMessage: string;
  public successMessage: string;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _subscriptionService: SubscriptionService,
    private _formBuilder: UntypedFormBuilder
  ) {
    this.errorMessage = '';
    this.successMessage = '';
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]]
    });

    this.form.valueChanges
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((_) => this.errorMessage = '');
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  public save(): void {
    this._subscriptionService
      .createSubscription(this.form.value)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        error: (e) => this.errorSubmit(e),
        next: () => this.successSubmit()
      });
  }

  private successSubmit(): void {
    this.successMessage = 'Successful registration, congratulations!';
    this.errorMessage = '';
    this.form.reset();
    setTimeout(() => {
      this.successMessage = '';
    }, 5000);
  }

  private errorSubmit(error: any):void  {
    this.errorMessage = 'Communication failure with the server.'
    console.error(error);
  }
}
