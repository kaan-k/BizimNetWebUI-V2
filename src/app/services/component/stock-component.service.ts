import { Injectable } from '@angular/core';
import { StockService } from '../common/stock.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { Stock } from '../../models/stock/stock';
import { StockAddDto } from '../../models/stock/stockAddDto';

@Injectable({
  providedIn: 'root'
})
export class StockComponentService {

  constructor(private stockService: StockService, private toastrService: ToastrService) { }

  async getByDeviceType(deviceType: number) {
    const observable = this.stockService.getByDeviceType(deviceType)
    const response = await firstValueFrom(observable)
    return response.data
  }

  async deleteStock(id: string, callBackfunction?: () => void) {
    const observable = await this.stockService.deleteStock(id)
    const promiseData = firstValueFrom(observable)
    promiseData.then(response => {
      this.toastrService.success(response.message)
      callBackfunction && callBackfunction()
    }).catch(error => {
      this.toastrService.error(error.error)
    })
  }

  async add(stock: StockAddDto, callBackfunction?: () => void) {
    const observable = await this.stockService.add(stock)
    const promiseData = firstValueFrom(observable)
    promiseData.then(response => {
      this.toastrService.success(response.message)
      callBackfunction && callBackfunction()
    }).catch(error => {
      this.toastrService.error(error.error)
    })
  }

  async update(stock: Stock, callBackfunction?: () => void) {
    const observable = await this.stockService.update(stock)
    const promiseData = firstValueFrom(observable)
    promiseData.then(response => {
      this.toastrService.success(response.message)
      callBackfunction && callBackfunction()
    }).catch(error => {
      this.toastrService.error(error.error)
    })
  }
}