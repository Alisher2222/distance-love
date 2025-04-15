import React, { useEffect, useState } from "react";
import "./../style/SharedWishlist.css";
import { useDispatch, useSelector } from "react-redux";
import { getWishlists } from "../store/wishlistsSlice";
import { deleteWish, getWishes } from "../store/wishesSlice";
import AddWish from "../components/addWish";
import AddWishlist from "../components/addWishlist";
import { AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import Navbar from "./../components/navbar";
import { getRelationshipData } from "../store/relationshipsSlice";
import { deleteWishlist } from "../store/wishlistsSlice";
const wishlistData = {
  recommended: [
    {
      name: "Couple Scrapbook Kit",
      emoji: "📚",
      reason: "Based on your travel memories",
    },
    {
      name: "Personalized Spotify Plaque",
      emoji: "🎵",
      reason: "You both love music",
    },
    { name: "Date Night Dice", emoji: "🎲", reason: "Make planning fun" },
  ],
  trending: [
    { name: "Sunset Lamp", emoji: "🌅", trend: "Viral on TikTok" },
    {
      name: "Love Language Card Game",
      emoji: "❤️",
      trend: "Top pick for couples",
    },
    { name: "Custom Star Map", emoji: "🌌", trend: "Unique and romantic" },
  ],
};

function SharedWishListPage() {
  const coupleId = useSelector((state) => state.relationships.coupleId);
  const wishlists = useSelector((state) => state.wishlists.wishlists);
  const wishes = useSelector((state) => state.wishes.wishes);
  const users = useSelector((state) => state.wishes.users);
  const userId = useSelector((state) => state.auth.userId);
  const partnerId = useSelector((state) => state.relationships.partnerData.id);

  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("saved");
  const [showAddWish, setShowAddWish] = useState(false);
  const [showAddWishlist, setShowAddWishlist] = useState(false);
  const [wishlistID, setWishlistID] = useState();
  const [IDs, setIDs] = useState({});

  useEffect(() => {
    dispatch(getWishlists({ coupleId }));
  }, []);

  useEffect(() => {
    if (wishlists.length !== 0) {
      const { created_id, partner_id } = wishlists[0];
      setIDs({ created_id, partner_id });
      dispatch(getWishes({ id1: created_id, id2: partner_id }));
    } else {
      dispatch(getRelationshipData({ coupleId, userId }));
    }
  }, [wishlists]);

  const formatDate = (sqlDate) => {
    const date = new Date(sqlDate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleShow = (id) => {
    setWishlistID(id);
    setShowAddWish(true);
  };

  const handleAddWishlist = () => {
    setShowAddWishlist(true);
  };

  const renderSavedTab = () => (
    <div className="saved-tab">
      {(wishlists || []).map((wishlist) => (
        <div key={wishlist.id} className="category-block">
          <div className="category-title">
            {wishlist.text}{" "}
            <X
              size={16}
              style={{ cursor: "pointer" }}
              onClick={() => dispatch(deleteWishlist({ id: wishlist.id }))}
            />
          </div>
          <div className="category-items">
            {(wishes || []).map(
              (wish) =>
                wish.wishlist_id === wishlist.id && (
                  <div key={wish.id} className="wish-item">
                    <div className="wish-info">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                        }}
                      >
                        <p className="wish-name">{wish.description}</p>
                        <p className="wish-meta">
                          Added by{" "}
                          {users.map(
                            (user) =>
                              user.id === wish.created_id &&
                              `${user.name} ${user.surname}`
                          )}{" "}
                          • {formatDate(wish.date_of_creation)}
                        </p>
                      </div>
                      <div style={{ cursor: "pointer" }}>
                        <X
                          size={16}
                          onClick={() => dispatch(deleteWish({ id: wish.id }))}
                        />
                      </div>
                    </div>
                  </div>
                )
            )}
          </div>
          <button
            className="add-wish-button"
            onClick={() => handleShow(wishlist.id)}
          >
            + Add new wish
          </button>
        </div>
      ))}
      <button className="add-wish-button" onClick={() => handleAddWishlist()}>
        + Add new wishlist
      </button>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="wishlist-container">
        <AnimatePresence>
          {showAddWish && (
            <AddWish
              setIsVisible={setShowAddWish}
              wishlistId={wishlistID}
              IDs={IDs}
            />
          )}
          {showAddWishlist && (
            <AddWishlist
              setIsVisible={setShowAddWishlist}
              IDs={{ partnerId, userId }}
            />
          )}
        </AnimatePresence>
        <div className="wishlist-card">
          <div className="wishlist-header">
            <div className="icon-circle">🎁</div>
            <h2 className="wishlist-title">Our Wishlist 💫</h2>
            <p className="wishlist-description">
              Things we dream about — together.
            </p>
          </div>

          {activeTab === "saved" && renderSavedTab()}
        </div>
      </div>
    </>
  );
}

export default SharedWishListPage;
