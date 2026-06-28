import styled from "styled-components/native";
import { colors } from "../../logged/dashboard/styles";

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${colors.bgDark};
`;

export const Background = styled.ImageBackground`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
`;

export const BackgroundOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(5, 4, 10, 0.55);
`;

export const LoaderWrapper = styled.View`
  align-items: center;
  justify-content: center;
`;

export const LoaderAnimation = styled.Image`
  width: 220px;
  height: 220px;
`;

export const StatusText = styled.Text`
  color: ${colors.textMuted};
  font-size: 13px;
  margin-top: 8px;
  text-align: center;
`;
