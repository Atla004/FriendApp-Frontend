import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SnackbarSaveChangesProps {
  saveChanges: () => void;
  discardChanges: () => void;
}

const SnackbarSaveChanges = ({saveChanges,discardChanges}: SnackbarSaveChangesProps) => {
  return (
    <View style={styles.snackbar}>
      <Text style={styles.snackbarText}>You have unsaved changes</Text>
      <View style={styles.snackbarButtons}>
        <TouchableOpacity
          style={styles.snackbarButton}
          onPress={() => discardChanges()}
        >
          <Text style={styles.snackbarButtonText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.snackbarButton, styles.snackbarButtonPrimary]}
          onPress={() => saveChanges()}
        >
          <Text
            style={[
              styles.snackbarButtonText,
              styles.snackbarButtonTextPrimary,
            ]}
          >
            Save
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default SnackbarSaveChanges;

const styles = StyleSheet.create({
  snackbar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  snackbarText: {
    color: "#666",
  },
  snackbarButtons: {
    flexDirection: "row",
  },
  snackbarButton: {
    marginLeft: 10,
    padding: 8,
    borderRadius: 4,
  },
  snackbarButtonPrimary: {
    backgroundColor: "#007AFF",
  },
  snackbarButtonText: {
    color: "#666",
  },
  snackbarButtonTextPrimary: {
    color: "white",
  },
});
