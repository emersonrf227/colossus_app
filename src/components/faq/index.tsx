import React, { useState, useCallback, useRef } from "react";
import {
  TouchableOpacity,
  Text,
  View,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { ChevronDown } from "lucide-react-native";
import styled from "styled-components/native";
import { colors } from "../../screens//logged/dashboard/styles"; // ajuste o caminho conforme sua estrutura

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Card = styled.View`
  background-color: ${colors.surface};
  border-width: 1px;
  border-color: ${colors.surfaceBorder};
  border-radius: 16px;
  margin-bottom: 10px;
  overflow: hidden;
`;

const QuestionRow = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
`;

const QuestionText = styled(Text)`
  flex: 1;
  color: ${colors.textPrimary};
  font-size: 14.5px;
  font-weight: 600;
  margin-right: 10px;
`;

const AnswerWrapper = styled(View)`
  padding: 0px 16px 16px 16px;
`;

const AnswerText = styled(Text)`
  color: ${colors.textMuted};
  font-size: 13.5px;
  line-height: 20px;
`;

interface AccordionItemProps {
  question: string;
  answer: string;
}

export function AccordionItem({ question, answer }: AccordionItemProps) {
  const [expanded, setExpanded] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const toggle = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => {
      const next = !prev;
      Animated.timing(rotateAnim, {
        toValue: next ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      return next;
    });
  }, [rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <Card>
      <QuestionRow onPress={toggle} activeOpacity={0.7}>
        <QuestionText>{question}</QuestionText>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <ChevronDown size={18} color={colors.textMuted} strokeWidth={2.2} />
        </Animated.View>
      </QuestionRow>

      {expanded && (
        <AnswerWrapper>
          <AnswerText>{answer}</AnswerText>
        </AnswerWrapper>
      )}
    </Card>
  );
}
