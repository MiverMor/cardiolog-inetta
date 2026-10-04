var swiper = new Swiper(".reviews-slider", {

	loop: true,

	navigation: {
		nextEl: ".reviews-slider__button--next",
		prevEl: ".reviews-slider__button--prev",
	},
});

$(document).ready(function() {
// Обработка формы
	$(".basic-form").each(function () {
		$(this).validate({
			errorClass: "invalid",
			messages: {
				name: {
					required: "Укажите имя",
					minlength: "Имя должно быть не короче 2 букв",
				},
				phone: {
					required: "Телефон обязателен",
					minlength: "Некоректно введен номер",
				},
			},
		});
});

// Маска для номера телефона с помощью плагина jQuery Mask Input
$(document).ready(function(){
  $(".mask-phone").mask("+7 (000) 000-00-00");

	$("#form-start-time").val(Date.now());

	$("#basic-form").submit(function(e) {
    e.preventDefault(); // Остановить стандартную отправку формы

		// Проверяем валидность формы
		if (!this.checkValidity()) {
			return;
		}

		$(".form-success, .form-error").remove(); // Удалим старые сообщения

    const formData = $(this).serialize();

    $.ajax({
      type: "POST",
      url: "php/telegram_bot.php",
      data: formData,
      dataType: "json",
      success: function(response) {
			if (response.success) {
				const successMsg = $('<p class="form-success">✅ ' + response.message + '</p>');
				$(".entry-form__form").append(successMsg);
				$("#basic-form")[0].reset();

				setTimeout(() => {
					successMsg.fadeOut(500, function() {
						$(this).remove();
					});
				}, 4000); // 4 секунды
			} else {
				const errorMsg = $('<p class="form-error">❌ Ошибка при отправке</p>');
				$(".entry-form__form").append(errorMsg);

				setTimeout(() => {
					errorMsg.fadeOut(500, function() {
						$(this).remove();
					});
				}, 4000);
			}
			},
			error: function() {
			const errorMsg = $('<p class="form-error">❌ Ошибка соединения</p>');
			$(".entry-form__form").append(errorMsg);

			setTimeout(() => {
				errorMsg.fadeOut(500, function() {
					$(this).remove();
				});
			}, 4000);
			}

    });
  });

});
});
var menuButton = document.querySelector('.menu-button');
var navbarBottom = document.querySelector('.navbar-bottom');
var menuLinks = document.querySelectorAll('.navbar-main__menu a');
var mobileVisibleLink = document.querySelector('.navbar-main__link_a');

	menuButton.addEventListener('click', function () {
		console.log("Клик по кнопке меню");
		navbarBottom.classList.toggle('navbar-bottom--mobile');
	});

	// Добавляем обработчик на каждый пункт меню
	menuLinks.forEach(function (link) {
		link.addEventListener('click', function () {
			console.log("Клик по пункту меню");
			navbarBottom.classList.remove('navbar-bottom--mobile');
		});
});
// Закрываем меню при клике по "Записаться"
if (mobileVisibleLink) {
	mobileVisibleLink.addEventListener('click', function () {
		console.log("Клик по 'Записаться'");
		navbarBottom.classList.remove('navbar-bottom--mobile');
	});
}