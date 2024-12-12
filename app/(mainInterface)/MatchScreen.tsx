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
import { useState, useRef, useCallback } from "react";
import { PersonCard } from "@/components/PersonCard";
const SWIPE_THRESHOLD = 120;

const MockData = [
  {
    id: 1,
    name: "deb Doe",
    imageUrl: "https://example.com/johndoe.jpg",
  },
  {
    id: 2,
    name: "Jane Doe",
    imageUrl: "https://example.com/janedoe.jpg",
  },
  {
    id: 3,
    name: "Alice",
    imageUrl: "https://example.com/alice.jpg",
  },
  {
    id: 4,
    name: "Bob",
    imageUrl: "https://example.com/bob.jpg",
  },
];

export default function MatchScreen() {
  const router = useRouter();
  const { profile } = useProfileContext();
  const [showModal, setShowModal] = useState(false);
  const position = useRef(new Animated.ValueXY()).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextPerson = () => {
    if (currentIndex < MockData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }

  useFocusEffect(
    useCallback(() => {
      console.log("MatchScreen focused profile", profile);
      console.log("profile.ready", profile.ready);
      setCurrentIndex(0);
      setShowModal(!profile.ready);
      return () => {
        console.log("MatchScreen unfocused");
      };
    }, [])
  );

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
    }).start(() => {
      nextPerson();
      fromAboveAnimation();

    });
  };

  const swipeRight = () => {
    Animated.timing(position, {
      toValue: { x: 600, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      console.log("swipeRight");
      nextPerson();
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
  }

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
        <PersonCard name={MockData[currentIndex].name} imageUrl={MockData[currentIndex].imageUrl} />
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
