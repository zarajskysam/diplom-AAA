/**
 * Класс Account наследуется от Entity.
 * Управляет счетами пользователя.
 * Имеет свойство URL со значением '/account'
 * */
class Account extends Entity{
    static URL = '/account';
    constructor(list1, get1){
        super(list1);
        super(get1);
    }
}