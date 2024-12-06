import { useAuth } from "../hooks/useAuth"
import IdCardDisplay from "../components/IdCardDisplay";
import { Loading } from "../components/Loading";
import useFetchCards from "../hooks/useFetchCards";
import StudentCardDisplay from "../components/StudentCardDisplay";
import HealthCareCardDisplay from "../components/HealthCareCardDisplay";

const Home: React.FC = () => {
    const { token } = useAuth();
    const { idCards, healthCareCards, studentCards, loading, refreshData } = useFetchCards(token?.access);

    // Generic function that renders cards based on the component type
    const renderCards = <T,>(
        cards: T[],
        Component: React.FC<{ card: T, refreshData: () => void; groupId: number | undefined }>
    ) => {
        if (!cards || cards.length === 0) return null;
        return cards.map((card, index) => <Component key={index} card={card} refreshData={refreshData} groupId={undefined} />);
    };

    const areAllCardListsEmpty = () => {
        return (
            (!idCards || idCards.length === 0) &&
            (!studentCards || studentCards.length === 0) &&
            (!healthCareCards || healthCareCards.length === 0)
        );
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <>
            {areAllCardListsEmpty() ? (
                <h4>You have no cards uploaded</h4>
            ) : (
                <>
                    {renderCards(idCards, IdCardDisplay)}
                    {renderCards(studentCards, StudentCardDisplay)}
                    {renderCards(healthCareCards, HealthCareCardDisplay)}
                </>
            )}
        </>

    )
}

export default Home