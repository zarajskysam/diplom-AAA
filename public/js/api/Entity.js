/**
 * Класс Entity - базовый для взаимодействия с сервером.
 * Имеет свойство URL, равно пустой строке.
 * */
class Entity {

  /**
   * Запрашивает с сервера список данных.
   * Это могут быть счета или доходы/расходы
   * (в зависимости от того, что наследуется от Entity)
   * */

  static URL = '';

  constructor(list1, get1) {
    this.list1 = list1;
    this.get1 = get1;
  }

  static list( data, callback = f => f) {
    return createRequest({
      url: this.URL,
      data: data,
      method: 'GET',
      responseType: 'json',
      callback: callback
   });
  }

  /**
   * Создаёт счёт или доход/расход с помощью запроса
   * на сервер. (в зависимости от того,
   * что наследуется от Entity)
   * */
  static create( data, callback = f => f ) {
    data._method = 'PUT';
    return createRequest({
      url: this.URL,
      data: data,
      method: 'POST',
      responseType: 'json',
      callback: callback
   });
  }

  /**
   * Получает информацию о счёте или доходе/расходе
   * (в зависимости от того, что наследуется от Entity)
   * */
  static get( id = '', data, callback = f => f ) {
    return createRequest({
      url: this.URL + `/${id}`,
      data: data,
      method: 'GET',
      responseType: 'json',
      callback: callback
   });
  }

  /**
   * Удаляет информацию о счёте или доходе/расходе
   * (в зависимости от того, что наследуется от Entity)
   * */
  static remove( id = '', data, callback = f => f ) {
    data._method = 'DELETE';
    return createRequest({
      url: this.URL,
      data: data,
      method: 'POST',
      responseType: 'json',
      callback: callback
   });
  }
}

