import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  Text,
  Button,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useProfileContext } from "@/context/ProfileContext";
import { useState, useRef, useCallback, useEffect } from "react";
import { PersonCard } from "@/components/PersonCard";
import { getMatchData, postLike } from "@/utils/fetch/fetch";
import { useUserData } from "@/context/UserDataContext";
import { User } from "@/schemas/types";
const SWIPE_THRESHOLD = 120;

interface Match {
  id: string;
  name: string;
  imageUrl: string;
}

export default function MatchScreen() {
  const router = useRouter();
  const { profile } = useProfileContext();
  const { _id, token } = useUserData();
  const [showModal, setShowModal] = useState(false);
  const position = useRef(new Animated.ValueXY()).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchData, setMatchData] = useState<Match[]>([]);
  const next = useRef<string | null>(null);

  const nextPerson = async() => {
    if (currentIndex < matchData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      if (next.current) {
        await getNewMatchData(token, next.current);
        setCurrentIndex(0);
      }
      await getNewMatchData(token);
      setCurrentIndex(0);
    }
  };

  useFocusEffect(
    useCallback(() => {
      console.log("MatchScreen focused profile", profile);
      console.log("profile.ready", profile.ready);
      setShowModal(!profile.ready);
      if (matchData.length === 0 || matchData.length === currentIndex + 1) {
        getNewMatchData(token);
      }

      return () => {
        console.log("MatchScreen unfocused");
      };
    }, [profile])
  );

  const getNewMatchData = async (token: any, page: string= '/api/match/get/1') => {
    let data
    // solo agarrar el ultimo numero de "/api/match/get/2" para saber la pagina y ponerlo en numberPage como numero
    if (page) {
      
      const numberPage = parseInt(page.split("/").pop() as string);
      data = await getMatchData(token, numberPage);

    } else {
       data = await getMatchData(token);
    }

    console.log("data", data.data.next);
    next.current = data.data.next;
    setMatchData(data.data.people);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      position.setValue({ x: gesture.dx, y: 0 });
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        swipeRight();
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        swipeLeft();
      } else {
        resetPosition();
      }
    },
  });

  const swipeLeft = () => {
    Animated.timing(position, {
      toValue: { x: -500, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(async() => {
      console.log("swipeLeft");
      postLike(token as string, matchData[currentIndex].id);
      await nextPerson();
      fromAboveAnimation();
    });
  };

  const swipeRight = () => {
    Animated.timing(position, {
      toValue: { x: 600, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(async() => {
      console.log("swipeRight");
      await nextPerson();
      fromAboveAnimation();
    });
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  const fromAboveAnimation = () => {
    //llevar a posicion de arriba sin animacion
    Animated.timing(position, {
      toValue: { x: 0, y: -500 },
      duration: 0,
      useNativeDriver: false,
    }).start();
    Animated.timing(position, {
      toValue: { x: 0, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-300, 0, 300],
      outputRange: ["-30deg", "0deg", "30deg"],
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate }],
    };
  };

  console.log("currentIndex");
  const personName = matchData[currentIndex]
    ? matchData[currentIndex].name
    : "";
  const personImageUrl = matchData[currentIndex]
    ? matchData[currentIndex].imageUrl
    : "";
  return (
    <View style={styles.container}>
      {showModal && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Complete your profile first!</Text>
            <Button
              title="Go to Profile"
              onPress={() => {
                setShowModal(false);
                router.push("/ProfileScreen");
              }}
            />
          </View>
        </View>
      )}

      <Animated.View
        style={[styles.card, getCardStyle()]}
        {...panResponder.panHandlers}
      >
        <PersonCard name={personName} imageUrl={personImageUrl} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  arrowContainer: {
    width: 50,
    alignItems: "center",
  },
  card: {
    flex: 1,
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
    padding: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  imageContainer: {
    flex: 1,
    borderRadius: 15,
    overflow: "hidden",
  },
  image: {
    flex: 1,
    backgroundColor: "#ddd",
  },
  modalContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
  },
});
