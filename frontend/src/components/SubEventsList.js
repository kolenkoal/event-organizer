import React, { useEffect, useState, useContext } from "react";
import { ListGroup } from "react-bootstrap";
import InfoSubEvent from "./InfoSubEvent";
import { DeleteEvent, FetchEventParticipants } from "../http/EventApi";
import { observer } from "mobx-react-lite";
import { Context } from "..";

const SubEventList = ({ subevents, onRegister, onUnregister, isCreator, onSubEventChange}) => {
    const { user } = useContext(Context);
    const [participantsData, setParticipantsData] = useState({}); // { subEventId: { count, isRegistered } }

    useEffect(() => {
        const fetchParticipants = async () => {
            let dataObj = {};
            for (let subevent of subevents) {
                try {
                    const data = await FetchEventParticipants(subevent.id);
                    dataObj[subevent.id] = {
                        count: data.participants.length,
                        isRegistered: data.participants.some(p => p.user_id === user._user?.id),
                    };
                } catch (error) {
                    console.error("Ошибка загрузки участников:", error);
                }
            }
            setParticipantsData(dataObj);
        };

        if (subevents.length > 0) {
            fetchParticipants();
        }
    }, [subevents, user._user?.id]);

    const onDeleteItem = async (id) => {
        try {
            await DeleteEvent(id);
            alert("Подмероприятие удалено");
            onSubEventChange();
        } catch (error) {
            console.error("Ошибка при удалении подмероприятия:", error);
        }
    };
    // console.log('subEventList', participantsData[subevents[0].id]?.isRegistered)
    return (
        <ListGroup className="w-100" style={{ maxHeight: "200px", overflowY: "auto" }}>
            {subevents.length > 0 ? (
                subevents.map((subevent) => (
                    <ListGroup.Item key={subevent.id} className="p-2">
                        <InfoSubEvent
                            isCreator={isCreator}
                            event={subevent}
                            onDeleteItem={onDeleteItem}
                            isRegisteredForSubEvent={participantsData[subevent.id]?.isRegistered || false}
                            participantCount={participantsData[subevent.id]?.count || 0}
                            onRegister={onRegister}
                            onUnregister={onUnregister}
                            setParticipantsData={setParticipantsData} 
                        />
                    </ListGroup.Item>
                ))
            ) : (
                <p className="text-muted text-center mt-2">Подмероприятий пока нет</p>
            )}
        </ListGroup>
    );
};

export default observer(SubEventList);
