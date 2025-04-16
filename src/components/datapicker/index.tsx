import { Modal, View, Text, Button } from "react-native";
import { Calendar } from "react-native-calendars";

export default function DatePickerModal({
  visible,
  onClose,
  onDateSelect,
  selectedDate,
}) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View
          style={{
            margin: 20,
            backgroundColor: "#fff",
            borderRadius: 10,
            padding: 10,
          }}
        >
          <Calendar
            onDayPress={(day) => {
              onDateSelect(day.dateString);
            }}
            markedDates={{
              [selectedDate]: {
                selected: true,
                selectedColor: "blue",
              },
            }}
            locale="pt-br"
          />
          <Button title="Fechar" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}
