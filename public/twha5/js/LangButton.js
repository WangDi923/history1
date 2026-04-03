'use strict';

function LangButton()
{
	const button_en = document.getElementById('lang-en');
	const button_zh = document.getElementById('lang-zh');
	let on_changed_handler = null;

	function update()
	{
		if (data.lang !== 'en' && data.lang !== 'zh') {
			data.lang = 'zh';
		}

		switch (data.lang) {
		case 'en':
			button_en.innerText = 'English';
			button_zh.innerText = 'Chinese';
			button_en.style.fontWeight = 'bold';
			button_zh.style.fontWeight = '';
			break;
		case 'zh':
			button_en.innerText = '英文';
			button_zh.innerText = '中文';
			button_en.style.fontWeight = '';
			button_zh.style.fontWeight = 'bold';
			break;
		}
		if (on_changed_handler) {
			on_changed_handler();
		}
	}

	this.onchanged = function(f)
	{
		on_changed_handler = f;
	};

	button_en.addEventListener('mousedown', function()
	{
		data.lang = 'en';
		update();
	});
	button_zh.addEventListener('mousedown', function()
	{
		data.lang = 'zh';
		update();
	});

	update();
}
