/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    if(!element) throw new Error('Элемент не найден');
    this.element = element;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update(options) {
    this.render( this.lastOptions ?  this.lastOptions : options );
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const removeAccountButton = this.element.querySelector('.remove-account');
    removeAccountButton.addEventListener( 'click', ()=>{
      this.removeAccount();
    });
    this.element.addEventListener('click', (e)=>{
      if (e.target.classList.contains('transaction__remove')) {
        this.removeTransaction(e.target.getAttribute('data-id'));
      }
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.update()
   * для обновления приложения
   * */
  removeAccount() {
    if (this.lastOption) {
      confirm('Вы действительно хотите удалить счёт?');
      let data = this.lastOption.account_id;
      let data1 = new FormData();
      data1.id = data;
      Account.remove( '', data1, () => {
        this.clear();
        App.update();
      });
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update()
   * */
  removeTransaction(element) {
    if (element) {
      confirm( 'Вы действительно хотите удалить транзакцию?' );
      let data1 = new FormData();
      data1.id = element;
      Transaction.remove( '', data1, () => {
        App.update();
      });
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render( options ) {
    if (!options) return;
    this.lastOption = options;
    Account.get(options.account_id, null, response => { 
      this.renderTitle(response.data.name);
    });
    Transaction.list(options, response => {
      this.renderTransactions(response.data);
    });
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    this.element.querySelector('.content-title').textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate( date ) {
    const inputDate = new Date( date );
    const DMY = inputDate.toLocaleString( 'ru', { year: 'numeric', month: 'long', day: 'numeric' });
    const HM = inputDate.toLocaleString( 'ru', { hour: 'numeric', minute: 'numeric' });
    return `${ DMY } в ${ HM }`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    return `<div class="transaction transaction_${ item.type.toLowerCase() } row">
    <div class="col-md-7 transaction__details">
      <div class="transaction__icon">
          <span class="fa fa-money fa-2x"></span>
      </div>
      <div class="transaction__info">
          <h4 class="transaction__title">${ item.name }</h4>
          <div class="transaction__date">${ this.formatDate( item.created_at )}</div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="transaction__summ">
          ${ item.sum } <span class="currency">₽</span>
      </div>
    </div>
    <div class="col-md-2 transaction__controls">
        <button class="btn btn-danger transaction__remove" data-id="${ item.id }">
            <i class="fa fa-trash"></i>  
        </button>
    </div>
    </div>`;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    if (data) {
      const content = this.element.querySelector('.content');
      content.innerHTML = '';
      data.forEach( item => content.insertAdjacentHTML( 'afterbegin', this.getTransactionHTML( item )));
    }
  }
}
