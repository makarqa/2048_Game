function color_changer(object, number) {
    return object.css("background", "RGB(" + 255 + "," + (255 - 2 * number) + "," + (255 - 2 * 8 * (number)) + ")")
}

function start_key_dawn(game) {
    $(document).bind("keydown", function (e) { //вызываю событие нажатия клавищи
        but_down(e, game);//передаю событие, наш созданный и уже вставленный объект, и само поле
    });
    $(".buttons").bind("click", function (e) {
        but_down(e.target.getAttribute("id"), game)
        //console.log(e.target.getAttribute("id"))
    });
    return
}

function counter(number) {
    $("#score").html(parseInt($("#score").html()?$("#score").html():0) + parseInt(number));
}

function add_obj(field) {
    var new_rand = Math.floor(Math.random() * 16);//берем рандомное число
    var rand_num = Math.floor(Math.random() * 12) < 10 ? 2 : 4;  // условие ? true : false


    if ($(field.children()[new_rand]).children().length == 0) {//проверяем колличество дочерних элементов у бокса, если он пустой, то вставляем

        var rand_element = field.children()[new_rand];//беру рандомный дочерний элемент всей игры
        var new_obj = $("<div class='box_move'>" + rand_num + "</div>");
        color_changer(new_obj, rand_num)
        $(rand_element).append(new_obj)// вставляют в родительый элемент наше число 2
    }
    else {//если нет, выполняем эту функцию рекурсией

        return add_obj(field);
    }
}

function but_down(e, game) {
    $(document).unbind("keydown");//убираем событие нажатия клавиши
    $(".buttons").unbind("click");
    var moved_elements = $(".box_move")// немного упростил, взяли все боксы которые должны двигаться

    if (e.keyCode == 37 || e == "left") {// up - 38, right - 39, down - 40, left - 37
        var left_move = new Array();//массив координат
        var mul_inner_num = new Array();
        var count_in_pole = [0, 0, 0, 0];//массив для строк
        var left_num_inner = [0, 0, 0, 0];//массив для старого содержимого ячейки
        var start_left = 10;//начальная координата по x
        var coun_animate = 0;
        var new_obj = false;//добавлять новый объект или нет

        for (var n = 0; n < moved_elements.length; n++) {//массив всех передвигаемых объектов
            var parent = $(moved_elements[n]).parent();//взял родительный элеменд передвигающегося бокса
            var parent_id = parent.attr("id");
            var pole = (parent_id % 4) ? Math.floor(parent_id / 4) : parent_id / 4 - 1;
            var in_element = moved_elements[n].innerHTML;//беру содержимую в объекте цифру

            if (count_in_pole[pole] > 0) {
                if (left_num_inner[pole] == in_element) {
                    left_move.push((start_left + 120 * count_in_pole[pole] - 120) + "px")
                    left_num_inner[pole] = 0;
                }
                else {
                    left_num_inner[pole] = in_element;
                    left_move.push((start_left + 120 * count_in_pole[pole]++) + "px")
                }
            }
            else {
                left_move.push((start_left + 120 * count_in_pole[pole]++) + "px")
                left_num_inner[pole] = in_element;
            }
        }

        for (var i = 0; i < moved_elements.length; i++) { //цикл колличества наших боксев которые передвигаются
            var element = $(moved_elements[i]);
            var left = element.parent().position().left //беру обсолютный отступ слева от бокса нашего числа
            var top = element.parent().position().top //беру обсолютный отступ сверху от бокса нашего числа
            var old_element = element // сохраняю наш элемент
            var old_element_parent = element.parent(); //беру родительский элемент нашего числа

            old_element_parent.parent().append(element) //вынимаю наше число из бокса и засовываю его поверх всех боксев

            old_element.css("position", "absolute"); //присваиаввю ему позицию абсолютную
            old_element.css("left", left + 10 + "px"); //отступ слева
            old_element.css("top", top + 10 + "px"); //отступ справа

            if (left_move[i] != ((left + 10) + "px")) {//ессли хоть 1 элемент поменял расположение
                new_obj = true//то разррешаем добавить элемент
            }

            old_element.animate({// создаю анимацию
                left: left_move[i], //перемещаю до левого края в 10px, теперь беру из созданного массива
                top: top + 10 + "px" //перемещаю на той же высоте
            }, 500, function () {//500 - время анимации, функция по окончании анимации
                var new_left = this.offsetLeft //сохранию новый отступ слева
                var new_top = this.offsetTop //сохранию новый отступ сверху

                var box_for_in = game.children().map(function (indx, elem_in_game) {// ищу бокс над которым наше число находится
                    if ($(elem_in_game).position().left == (new_left - 10) && $(elem_in_game).position().top == (new_top - 10))// проверяю каждый элемент по отступу сверху и слева, если нашел, то возвращаю этот элемент
                        return elem_in_game
                })//засовываю наше число в него

                if (box_for_in.children().length) {//если там уже чето есть
                    box_for_in.children()[0].innerHTML *= 2;//то увеличиваем это содержимое на 2
                    $(this).remove();//удаляю этот объект с поля
                    color_changer($(box_for_in.children()[0]), box_for_in.children()[0].innerHTML)
                    counter(box_for_in.children()[0].innerHTML)
                }
                else {//если бокс был пустой
                    box_for_in.append(this)//то засовываем в него передвигающийся элемент
                }

                coun_animate++//каждый раз увеличиваем счетчик анимаций
                if (coun_animate == i) {//если все анимации закончились
                    start_key_dawn(game)//возвращаем событий
                    coun_animate = 0//обнуляем счетчик
                    if (new_obj)
                        add_obj(game);//добавляем новый элемент
                }
            })
        }
    }

    if (e.keyCode == 38 || e == "up") {// up - 38, right - 39, down - 40, left - 37
        var up_move = new Array();//массив координат
        var count_in_col = [0, 0, 0, 0];//массив для колонок
        var top_num_inner = [0, 0, 0, 0];//массив для старого содержимого ячейки

        var start_top = 10;//начальная координата по x
        var coun_animate = 0;
        var new_obj = false;//добавлять новый объект или нет

        for (var n = 0; n < moved_elements.length; n++) {//массив всех передвигаемых объектов
            var parent = $(moved_elements[n]).parent();//взял родительный элеменд передвигающегося бокса
            var parent_id = parent.attr("id");
            var col = (parent_id % 4) ? parent_id % 4 - 1 : 3;//беру номер колонки по остатку от деления id
            var in_element = moved_elements[n].innerHTML;//беру содержимую в объекте цифру

            if (count_in_col[col] > 0) {//если в колонке уже были передвигающиеся боксы
                if (top_num_inner[col] == moved_elements[n].innerHTML) {//если цифра равна выше стоящей цифре
                    up_move.push((start_top + 120 * count_in_col[col] - 120 ) + "px")//вычисляю координаты, так чтобы он встал на месте выше стоящей цифры
                    top_num_inner[col] = 0//обнуляю цифру
                }
                else {//если не равна
                    top_num_inner[col] = in_element;//то запоминаем цифру
                    up_move.push((start_top + 120 * count_in_col[col]++ ) + "px")//и вычисляем координату чтобы она стояла ниже
                }
            }
            else {//если еще не было элементов в колонке
                up_move.push((start_top + 120 * count_in_col[col]++ ) + "px")//вычисляем координаты, тут в любом случае будет 10px
                top_num_inner[col] = in_element;//запоминаем содержимое
            }
        }

        for (var i = 0; i < moved_elements.length; i++) { //цикл колличества наших боксев которые передвигаются
            var element = $(moved_elements[i]);
            var left = element.parent().position().left //беру обсолютный отступ слева от бокса нашего числа
            var top = element.parent().position().top //беру обсолютный отступ сверху от бокса нашего числа
            var old_element = element // сохраняю наш элемент
            var old_element_parent = element.parent(); //беру родительский элемент нашего числа
            old_element_parent.parent().append(element)

            old_element.css("position", "absolute");
            old_element.css("left", left + 10 + "px");
            old_element.css("top", top + 10 + "px");

            if (up_move[i] != ((top + 10) + "px")) {//ессли хоть 1 элемент поменял расположение
                new_obj = true//то разррешаем добавить элемент
            }

            old_element.animate({
                left: left + 10 + "px",
                top: up_move[i]//берем из массива координаты
            }, 500, function () {
                var new_left = this.offsetLeft
                var new_top = this.offsetTop

                var box_for_in = game.children().map(function (indx, elem_in_game) {
                    if ($(elem_in_game).position().left == (new_left - 10) && $(elem_in_game).position().top == (new_top - 10))
                        return elem_in_game
                })//засунул в переменную возвразщенный объект
                if (box_for_in.children().length) {//если там уже чето есть
                    box_for_in.children()[0].innerHTML *= 2;//то увеличиваем это содержимое на 2
                    $(this).remove();//удаляю этот объект с поля
                    color_changer($(box_for_in.children()[0]), box_for_in.children()[0].innerHTML)
                    counter(box_for_in.children()[0].innerHTML)
                }
                else {//если бокс был пустой
                    box_for_in.append(this)//то засовываем в него передвигающийся элемент
                }


                coun_animate++
                if (coun_animate == i) {
                    start_key_dawn(game)
                    coun_animate = 0
                    if (new_obj)
                        add_obj(game);//добавляем новый элемент
                }
            })
        }
    }

    if (e.keyCode == 39 || e == "right") {// up - 38, right - 39, down - 40, left - 37
        var right_move = new Array();//массив координат
        var mul_inner_num = new Array();
        var count_in_pole = [0, 0, 0, 0];//массив для строк
        var left_num_inner = [0, 0, 0, 0];//массив для старого содержимого ячейки

        var start_left = 470;//начальная координата по x
        var coun_animate = moved_elements.length;
        ;
        var new_obj = false;//добавлять новый объект или не

        for (var n = moved_elements.length - 1; n >= 0; n--) {//массив всех передвигаемых объектов
            var parent = $(moved_elements[n]).parent();//взял родительный элеменд передвигающегося бокса
            var parent_id = parent.attr("id");
            var pole = (parent_id % 4) ? Math.floor(parent_id / 4) : parent_id / 4 - 1;
            var in_element = moved_elements[n].innerHTML;//беру содержимую в объекте цифру

            if (count_in_pole[pole] > 0) {
                if (left_num_inner[pole] == in_element) {
                    right_move.unshift((start_left - 120 * count_in_pole[pole] + 20) + "px")
                    left_num_inner[pole] = 0;
                }
                else {
                    left_num_inner[pole] = in_element;
                    right_move.unshift((start_left - 120 * count_in_pole[pole]++ - 100) + "px")
                }
            }
            else {
                right_move.unshift((start_left - 120 * count_in_pole[pole]++ - 100) + "px")
                left_num_inner[pole] = in_element;
            }
        }

        for (var i = moved_elements.length - 1; i >= 0; i--) { //цикл колличества наших боксев которые передвигаются
            var element = $(moved_elements[i]);
            var left = element.parent().position().left //беру обсолютный отступ слева от бокса нашего числа
            var top = element.parent().position().top //беру обсолютный отступ сверху от бокса нашего числа
            var old_element = element // сохраняю наш элемент
            var old_element_parent = element.parent(); //беру родительский элемент нашего числа

            old_element_parent.parent().append(element) //вынимаю наше число из бокса и засовываю его поверх всех боксев

            old_element.css("position", "absolute"); //присваиаввю ему позицию абсолютную
            old_element.css("left", left + 10 + "px"); //отступ слева
            old_element.css("top", top + 10 + "px"); //отступ справа

            if (right_move[i] != ((left + 10) + "px")) {//ессли хоть 1 элемент поменял расположение
                new_obj = true//то разррешаем добавить элемент
            }

            old_element.animate({// создаю анимацию
                left: right_move[i], //перемещаю до левого края в 10px
                top: top + 10 + "px" //перемещаю на той же высоте
            }, 500, function () {//500 - время анимации, функция по окончании анимации
                var new_left = this.offsetLeft //сохранию новый отступ слева
                var new_top = this.offsetTop //сохранию новый отступ сверху


                var box_for_in = game.children().map(function (indx, elem_in_game) {// ищу бокс над которым наше число находится
                    if ($(elem_in_game).position().left == (new_left - 10) && $(elem_in_game).position().top == (new_top - 10))// проверяю каждый элемент по отступу сверху и слева, если нашел, то возвращаю этот элемент
                        return elem_in_game
                })//засовываю наше число в него

                if (box_for_in.children().length) {//если там уже чето есть
                    box_for_in.children()[0].innerHTML *= 2;//то увеличиваем это содержимое на 2
                    $(this).remove();//удаляю этот объект с поля
                    color_changer($(box_for_in.children()[0]), box_for_in.children()[0].innerHTML)
                    counter(box_for_in.children()[0].innerHTML)
                }
                else {//если бокс был пустой
                    box_for_in.append(this)//то засовываем в него передвигающийся элемент
                }

                coun_animate--
                if (coun_animate == 0) {
                    start_key_dawn(game)
                    coun_animate = moved_elements.length
                    if (new_obj)
                        add_obj(game);//добавляем новый элемент
                }
            })

        }
    }
    if (e.keyCode == 40 || e == "down") {// up - 38, right - 39, down - 40, left - 37
        var down_move = new Array();//массив координат
        var count_in_col = [0, 0, 0, 0];//массив для колонок
        var down_num_inner = [0, 0, 0, 0];//массив для старого содержимого ячейки

        var start_top = 470;//начальная координата по x
        var coun_animate = moved_elements.length;
        var new_obj = false;//добавлять новый объект или нет

        for (var n = moved_elements.length - 1; n >= 0; n--) {//массив всех передвигаемых объектов
            var parent = $(moved_elements[n]).parent();//взял родительный элеменд передвигающегося бокса
            var parent_id = parent.attr("id");
            var col = (parent_id % 4) ? parent_id % 4 - 1 : 3;//беру номер колонки по остатку от деления id
            var in_element = moved_elements[n].innerHTML;//беру содержимую в объекте цифру

            if (count_in_col[col] > 0) {//если в колонке уже были передвигающиеся боксы
                if (down_num_inner[col] == moved_elements[n].innerHTML) {//если цифра равна выше стоящей цифре
                    down_move.unshift((start_top - 120 * count_in_col[col] + 20) + "px")//вычисляю координаты, так чтобы он встал на месте выше стоящей цифры
                    down_num_inner[col] = 0//обнуляю цифру
                }
                else {//если не равна
                    down_num_inner[col] = in_element;//то запоминаем цифру
                    down_move.unshift((start_top - 120 * count_in_col[col]++ - 100) + "px")//и вычисляем координату чтобы она стояла ниже
                }
            }
            else {//если еще не было элементов в колонке
                down_move.unshift((start_top - 100 * count_in_col[col]++ - 100) + "px")//вычисляем координаты, тут в любом случае будет 10px
                down_num_inner[col] = in_element;//запоминаем содержимое
            }
        }


        for (var i = moved_elements.length - 1; i >= 0; i--) {//цикл колличества наших боксев которые передвигаются
            var element = $(moved_elements[i]);
            var left = element.parent().position().left //беру обсолютный отступ слева от бокса нашего числа
            var top = element.parent().position().top //беру обсолютный отступ сверху от бокса нашего числа
            var old_element = element // сохраняю наш элемент
            var old_element_parent = element.parent(); //беру родительский элемент нашего числа

            old_element_parent.parent().append(element) //вынимаю наше число из бокса и засовываю его поверх всех боксев

            old_element.css("position", "absolute"); //присваиаввю ему позицию абсолютную
            old_element.css("left", left + 10 + "px"); //отступ слева
            old_element.css("top", top + 10 + "px"); //отступ справа
            if (down_move[i] != ((top + 10) + "px")) {//ессли хоть 1 элемент поменял расположение
                new_obj = true//то разррешаем добавить элемент
            }

            old_element.animate({// создаю анимацию
                left: left + 10 + "px",
                top: down_move[i]
            }, 500, function () {//500 - время анимации, функция по окончании анимации
                var new_left = this.offsetLeft //сохранию новый отступ слева
                var new_top = this.offsetTop //сохранию новый отступ сверху

                var box_for_in = game.children().map(function (indx, elem_in_game) {// ищу бокс над которым наше число находится
                    if ($(elem_in_game).position().left == (new_left - 10) && $(elem_in_game).position().top == (new_top - 10))// проверяю каждый элемент по отступу сверху и слева, если нашел, то возвращаю этот элемент
                        return elem_in_game
                })
                if (box_for_in.children().length) {//если там уже чето есть
                    box_for_in.children()[0].innerHTML *= 2;//то увеличиваем это содержимое на 2
                    $(this).remove();//удаляю этот объект с поля
                    color_changer($(box_for_in.children()[0]), box_for_in.children()[0].innerHTML)
                    counter(box_for_in.children()[0].innerHTML)
                }
                else {//если бокс был пустой
                    box_for_in.append(this)//то засовываем в него передвигающийся элемент
                }

                coun_animate--
                if (coun_animate == 0) {
                    start_key_dawn(game)
                    coun_animate = moved_elements.length
                    if (new_obj)
                        add_obj(game);//добавляем новый элемент
                }
            })

        }
    }
}


window.onload = function () {
    var game = $("#game")
    add_obj(game);// вызываем 2 раза функцию вставки объекта
    add_obj(game);

    start_key_dawn(game);
}