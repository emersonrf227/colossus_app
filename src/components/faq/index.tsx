import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";

const AccordionContainer = styled.View`
  width: 90%;
  max-width: 90%;
  margin-bottom: 10px;
  background-color: #1c1c1c;
  border-radius: 10px;
  padding: 10px;
  align-self: center;
`;

const QuestionText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const AnswerText = styled.Text`
  color: #ccc;
  font-size: 14px;
  margin-top: 10px;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

interface AccordionItemProps {
  question: string;
  answer: string;
}

export const AccordionItem = ({ question, answer }: AccordionItemProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <AccordionContainer>
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <Row>
          <QuestionText>{question}</QuestionText>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={20}
            color="white"
          />
        </Row>
      </TouchableOpacity>
      {expanded && <AnswerText>{answer}</AnswerText>}
    </AccordionContainer>
  );
};
