import { useEffect } from "react";
import "../style/requests.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllRequests,
  createRelationship,
  rejectRequest,
} from "../store/relationshipsSlice";

function Requests() {
  const id = useSelector((state) => state.auth.userId);
  const data = useSelector((state) => state.relationships.requests);
  const dispatch = useDispatch();

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "status-pending";
      case "active":
        return "status-active";
      case "reject":
        return "status-reject";
      default:
        return "status-default";
    }
  };

  useEffect(() => {
    if (id) dispatch(getAllRequests({ id }));
  }, [dispatch, id]);

  const handleAccept = (senderId, receiverId) => {
    dispatch(createRelationship({ senderId: senderId, receiverId: receiverId }))
      .unwrap()
      .then(() => {
        dispatch(getAllRequests({ id }));
      })
      .catch((error) => {
        console.error("Ошибка при принятии запроса:", error);
      });
  };

  const handleReject = (senderId, receiverId) => {
    dispatch(rejectRequest({ senderId, receiverId }))
      .unwrap()
      .then(() => {
        dispatch(getAllRequests({ id }));
      })
      .catch((error) => {
        console.error("Ошибка при отклонении запроса:", error);
      });
  };

  return (
    <div className="requests-wrapper">
      {(data || []).map(([relationshipObj, people]) => {
        const { relationship } = relationshipObj;
        const statusClass = getStatusClass(relationship.status);
        const isPending = relationship.status === "pending";
        const isUserReceiver = relationship.receiver_id === id;

        return (
          <div key={relationship.id} className={`request-box ${statusClass}`}>
            <p>
              <strong>Sender:</strong> {people.sender.name}{" "}
              {people.sender.surname}
            </p>
            <p>
              <strong>Receiver:</strong> {people.receiver.name}{" "}
              {people.receiver.surname}
            </p>
            <p>
              <em>Status:</em> {relationship.status}
            </p>

            {isPending && isUserReceiver && (
              <div className="action-buttons">
                <button
                  className="accept-button"
                  onClick={() =>
                    handleAccept(
                      relationship.sender_id,
                      relationship.receiver_id
                    )
                  }
                >
                  Принять
                </button>
                <button
                  className="reject-button"
                  onClick={() =>
                    handleReject(
                      relationship.sender_id,
                      relationship.receiver_id
                    )
                  }
                >
                  Отклонить
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Requests;
