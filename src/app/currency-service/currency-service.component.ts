import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Currency } from 'src/app/Currency';

@Injectable({
  providedIn: 'root',
})
export class CurrencyServiceComponent {
  private currencies: Currency[] = [];
  private lastUpdate: string;

  constructor(private http: HttpClient) {}

  public getCurrencies() {
    return this.currencies;
  }

  public getLastUpdate() {
    return this.lastUpdate;
  }

  public getCurrenciesPromise() {
    return new Promise<any>((resolve, reject) => {
      if (this.currencies.length === 0) {
        this.http
          .get<any>('https://api.exchangerate-api.com/v4/latest/UAH')
          .subscribe(
            (data) => {
              const usdRate = data.rates['USD'];
              const eurRate = data.rates['EUR'];

              if (usdRate && eurRate) {
                this.currencies.push({
                  rate: 1,
                  full_name: 'Ukrainian Hryvnia',
                  name: 'UAH',
                  symbol: '₴',
                });
                this.currencies.push({
                  rate: usdRate,
                  full_name: 'US Dollar',
                  name: 'USD',
                  symbol: '$',
                });
                this.currencies.push({
                  rate: eurRate,
                  full_name: 'Euro',
                  name: 'EUR',
                  symbol: '€',
                });
              }

              this.lastUpdate = data.date;
              resolve(this.currencies);
            },
            () => reject()
          );
      } else {
        resolve(this.currencies);
      }
    });
  }
}
