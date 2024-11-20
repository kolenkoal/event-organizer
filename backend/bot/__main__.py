import asyncio

from aiogram import Bot, types

from bot.bot import dp
from bot.settings import TelegramBotSettings


async def main():
    bot_token = TelegramBotSettings().token
    bot = Bot(token=bot_token)

    await bot.set_my_commands(
        [
            types.BotCommand(command="get_all_events", description="Все доступные мероприятия"),
            types.BotCommand(command="get_all_my_events", description="Мероприятия, организованных мной"),
            types.BotCommand(
                command="get_my_participations", description="Мероприятия, на которые я зарегистрировался (-ась)"
            ),
        ]
    )

    await dp.start_polling(bot, handle_signals=False)


if __name__ == "__main__":
    asyncio.run(main())
