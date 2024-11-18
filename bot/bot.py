import os
from asyncio import sleep
from datetime import datetime
from typing import Dict, List

import httpx
from aiogram import Dispatcher, types
from aiogram.enums import ParseMode
from aiogram.filters import Command
from aiogram.types import FSInputFile
from ics import Calendar, Event

from bot.settings import TelegramBotSettings

bot_settings = TelegramBotSettings()
EVENTS_URL = bot_settings.events_url
AUTH_URL = bot_settings.auth_url
START_MESSAGE = "Привет! Я бот для управления событиями. Нажмите на команды, чтобы узнать, что я умею"

dp = Dispatcher()

access_tokens: Dict[str, str] = {}


def format_event_list(events: List[Dict], with_organizer: bool = False) -> str:
    formatted_message = "Список событий:\n\n"
    for i, event in enumerate(events, start=1):
        start_time = datetime.fromisoformat(event["start_time"].replace("Z", "+00:00"))
        end_time = datetime.fromisoformat(event["end_time"].replace("Z", "+00:00"))
        formatted_message += (
            f"{i}. **Название:** {event['title']}\n"
            f"     **Описание:** {event['description']}\n"
            f"     **Начало:** {start_time.strftime('%d.%m.%Y %H:%M')}\n"
            f"     **Окончание:** {end_time.strftime('%d.%m.%Y %H:%M')}\n"
            f"     **Местоположение:** {event['location']}\n"
        )
        if with_organizer:
            formatted_message += "     **Организатор:** Вы\n"
        formatted_message += "\n"
    return formatted_message


async def make_authorized_request(url: str, username: str, method: str = "GET", **kwargs) -> httpx.Response:
    headers = {"Authorization": f"Bearer {access_tokens[username]}"}
    async with httpx.AsyncClient() as client:
        return await getattr(client, method.lower())(url, headers=headers, **kwargs)


def add_event_to_calendar(calendar: Calendar, event: Dict) -> None:
    new_event = Event()
    new_event.name = event["title"]
    new_event.begin = event["start_time"]
    new_event.end = event["end_time"]
    new_event.location = event["location"]
    new_event.description = event["description"]
    calendar.events.add(new_event)


@dp.message(Command("start"))
async def start_handler(message: types.Message):
    await get_or_create_user(message.chat)
    await message.reply(START_MESSAGE)


@dp.message(Command("get_all_events"))
async def get_all_events(message: types.Message):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{EVENTS_URL}/all")

        if response.status_code == 200:
            events = response.json()["events"]
            formatted_message = format_event_list(events)
            await message.answer(formatted_message, parse_mode=ParseMode.MARKDOWN)


@dp.message(Command("get_all_my_events"))
async def get_all_my_events(message: types.Message):
    username = message.chat.username
    if username not in access_tokens:
        await get_or_create_user(message.chat)

    response = await make_authorized_request(f"{EVENTS_URL}/my/organize", username)
    if response.status_code == 200:
        events = response.json()["events"]
        formatted_message = format_event_list(events, with_organizer=True)
        await message.answer(formatted_message, parse_mode=ParseMode.MARKDOWN)


@dp.message(Command("get_my_participations"))
async def get_my_participations(message: types.Message):
    username = message.chat.username
    if username not in access_tokens:
        await get_or_create_user(message.chat)

    response = await make_authorized_request(f"{EVENTS_URL}/my/participate", username)
    if response.status_code == 200:
        calendar = Calendar()
        event_file = f"{username}_events.ics"
        events = response.json()["events"]
        formatted_message = format_event_list(events)

        for event in events:
            add_event_to_calendar(calendar, event)

        with open(event_file, "w") as my_file:
            my_file.writelines(calendar)

        await message.answer(formatted_message, parse_mode=ParseMode.MARKDOWN)
        await sleep(2)
        await message.answer_document(
            FSInputFile(event_file),
            caption="Также прислали вам файл с мероприятиями! Можете добавить их себе в календарь, чтобы ничего не забыть",
        )
        os.remove(event_file)


async def get_or_create_user(user_info: types.Chat):
    async with httpx.AsyncClient() as client:
        await client.post(
            f"{AUTH_URL}/register",
            json={
                "email": f"{user_info.username}@mail.ru",
                "password": "string",
                "external_id": user_info.id,
                "last_name": "string",
                "first_name": "string",
            },
        )
        response = await client.post(
            f"{AUTH_URL}/login",
            data={
                "username": f"{user_info.username}@mail.ru",
                "password": "string",
            },
        )
        access_tokens[user_info.username] = response.json()["access_token"]
