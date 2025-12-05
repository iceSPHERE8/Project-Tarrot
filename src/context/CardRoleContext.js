import { createContext, useContext } from "react";

const cardRoleText = createContext("");

export function useCardRole() {
    const context = useContext(cardRoleText);
    if (!context) {
        throw new Error("useCardRole must be used within a CardRoleProvider");
    }
    return context;
}

export function CardRoleProvider({ children, cardRole }) {
    return (
        <cardRoleText.Provider value={cardRole}>
            {children}
        </cardRoleText.Provider>
    );
}
