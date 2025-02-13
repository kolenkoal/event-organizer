import { useState } from "react";
import { Modal, Button, Accordion } from "react-bootstrap";
// import { HelpCircle } from "lucide-react";

const QuestionModal = ({show, onHide}) => {
    // const [show, setShow] = useState(false);

    // const handleClose = () => setShow(false);
    // const handleShow = () => setShow(true);

    return (
        <>
            {/* Иконка в Navbar */}
            {/* <HelpCircle
                size={24}
                className="cursor-pointer"
                onClick={handleShow}
            /> */}

            {/* Модальное окно */}
            <Modal show={show} onHide={onHide} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Часто задаваемые вопросы</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Как записаться на мероприятие как обычный слушатель ?</Accordion.Header>
                            <Accordion.Body>
                                На странице мероприятия нажмите кнопку "Зарегистрироваться".
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Как подать заявку на выступление с подготовленным материалом ?</Accordion.Header>
                            <Accordion.Body>
                                На странице мероприятия нажмите кнопку "Подать заявку" и приложите Ваш файл.
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2">
                            <Accordion.Header>Как увидеть мероприятия, на которые я записался или создал ?</Accordion.Header>
                            <Accordion.Body>
                                В "Личном кабинете" вы сможете найти всю информацию.
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="3">
                            <Accordion.Header>Можно ли увидеть мероприятия, в которых я один из участников или заявки на участие в мои мероприятия ?</Accordion.Header>
                            <Accordion.Body>
                                В "Заявках" вы сможете найти всю информацию.
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={onHide}>
                        Закрыть
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default QuestionModal;
