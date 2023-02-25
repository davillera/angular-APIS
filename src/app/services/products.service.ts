import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { retry, catchError, map } from 'rxjs/operators';
import { throwError, zip } from 'rxjs';

import { CreateProductDTO, Product, UpdateProductDTO } from './../models/product.model';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiURL = `${environment.API_URL}/api/products`;

  constructor(
    private http: HttpClient
  ) { }

  getProductsByPage(limit: number, offset: number) {
    return this.http.get<Product[]>(`${this.apiURL}`, {
      params: { limit, offset },
    });
  }

  getAllProducts(limit?: number, offset?: number) {
    let params = new HttpParams();
    if (limit && offset) {
      params = params.set('limit', limit);
      params = params.set('offset', limit);
    }
    return this.http.get<Product[]>(this.apiURL, { params })
      .pipe(
        retry(3),
        map(products => products.map(item =>{
          return{
            ...item,
            taxes: item.price*0.19
          }
        }))
      );
  }
  fetchReadAndUpdate(id: string, dto: UpdateProductDTO) {
    return zip(
      this.getProduct(id),
      this.update(id, dto)
    );
  }
  getProduct(id: string) {
    return this.http.get<Product>(`${this.apiURL}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === HttpStatusCode.Conflict) {
          return throwError('Algo falla en el servidor');
        }
        if (error.status === HttpStatusCode.NotFound) {
          return throwError('No encontrado :(');
        }
        if (error.status === HttpStatusCode.Unauthorized) {
          return throwError('No estas Autorizado >:v');
        }
        return throwError('Ups, Algo salió mal');
      })
    );
  }

  create(dto: CreateProductDTO) {
    return this.http.post<Product>(this.apiURL, dto);
  }

  update(id: string, dto: any) {
    return this.http.put<Product>(`${this.apiURL}/${id}`, dto);
  }

  delete(id: string) {
    return this.http.delete<boolean>(`${this.apiURL}/${id}`);
  }
}
