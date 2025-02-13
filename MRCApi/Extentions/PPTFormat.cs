using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Presentation;
using Drawing = DocumentFormat.OpenXml.Drawing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using System.Net;
using System.Drawing.Imaging;
using System.Drawing;

namespace MRCApi.Extentions
{
    public class PPTFormat
    {
        public static byte[] ResizeImage(byte[] byteImageIn)
        {
            byte[] resizedImage = byteImageIn;
            MemoryStream ms = new MemoryStream(resizedImage);
            using (Image orginalImage =Image.FromStream(ms))
            {
                ImageFormat orginalImageFormat = orginalImage.RawFormat;
                int orginalImageWidth = orginalImage.Width;
                int orginalImageHeight = orginalImage.Height;
                int resizedImageWidth = 400; // Type here the width you want
                int resizedImageHeight = Convert.ToInt32(resizedImageWidth * orginalImageHeight / orginalImageWidth);
                using (Bitmap bitmapResized = new Bitmap(orginalImage, resizedImageWidth, resizedImageHeight))
                {
                    using (MemoryStream streamResized = new MemoryStream())
                    {
                        bitmapResized.Save(streamResized, orginalImageFormat);
                        resizedImage = streamResized.ToArray();
                    }
                }
            }
            return resizedImage;
        }

        #region Export PPTX
        public static void AddTextbox(SlidePart slidePart, string boxName, uint id, long xPos, long yPos, long width, long height, List<Drawing.Paragraph> paragraphs)
        {
            var textBody = new TextBody();
            Drawing.BodyProperties bodyProperties20 = new Drawing.BodyProperties() { Wrap = Drawing.TextWrappingValues.Square, RightToLeftColumns = false };
            Drawing.ShapeAutoFit shapeAutoFit1 = new Drawing.ShapeAutoFit();
            bodyProperties20.Append(shapeAutoFit1);
            Drawing.ListStyle listStyle20 = new Drawing.ListStyle();

            textBody.Append(bodyProperties20);
            textBody.Append(listStyle20);
            textBody.Append(CreateParagraph("Văn Hòa 123", true, false));
            //foreach (var p in paragraphs)
            //    textBody.Append(p);

            Shape shape8 = new Shape();
            NonVisualShapeProperties nonVisualShapeProperties8 = new NonVisualShapeProperties();
            NonVisualDrawingProperties nonVisualDrawingProperties11 = new NonVisualDrawingProperties() { Id = (UInt32Value)id, Name = boxName };
            NonVisualShapeDrawingProperties nonVisualShapeDrawingProperties8 = new NonVisualShapeDrawingProperties() { TextBox = true };
            ApplicationNonVisualDrawingProperties applicationNonVisualDrawingProperties11 = new ApplicationNonVisualDrawingProperties();
            nonVisualShapeProperties8.Append(nonVisualDrawingProperties11);
            nonVisualShapeProperties8.Append(nonVisualShapeDrawingProperties8);
            nonVisualShapeProperties8.Append(applicationNonVisualDrawingProperties11);

            ShapeProperties shapeProperties8 = new ShapeProperties();
            var transform2D8 = new Drawing.Transform2D();
            Drawing.Offset offset11 = new Drawing.Offset() { X = xPos, Y = yPos };
            Drawing.Extents extents11 = new Drawing.Extents() { Cx = width, Cy = height };
            transform2D8.Append(offset11);
            transform2D8.Append(extents11);

            Drawing.PresetGeometry presetGeometry7 = new Drawing.PresetGeometry() { Preset = Drawing.ShapeTypeValues.Rectangle };
            Drawing.AdjustValueList adjustValueList7 = new Drawing.AdjustValueList();
            presetGeometry7.Append(adjustValueList7);
            Drawing.NoFill noFill2 = new Drawing.NoFill();
            shapeProperties8.Append(transform2D8);
            shapeProperties8.Append(presetGeometry7);
            shapeProperties8.Append(noFill2);

            shape8.Append(nonVisualShapeProperties8);
            shape8.Append(shapeProperties8);
            shape8.Append(textBody);
            slidePart.Slide.CommonSlideData.ShapeTree.Append(shape8);
        }
        public static  Drawing.Paragraph CreateParagraph(string text, bool isLastParagraph, bool isBold)
        {
            Drawing.Paragraph paragraph25 = new Drawing.Paragraph();
            Drawing.Run run21 = new Drawing.Run();
            Drawing.RunProperties runProperties24 = new Drawing.RunProperties() { Language = "en-US", FontSize = 1400, Dirty = false, Bold = isBold };
            Drawing.LatinFont latinFont24 = new Drawing.LatinFont() { Typeface = "Verdana", PitchFamily = 34, CharacterSet = 0 };
            Drawing.EastAsianFont eastAsianFont24 = new Drawing.EastAsianFont() { Typeface = "Verdana", PitchFamily = 34, CharacterSet = 0 };
            Drawing.ComplexScriptFont complexScriptFont24 = new Drawing.ComplexScriptFont() { Typeface = "Verdana", PitchFamily = 34, CharacterSet = 0 };
            runProperties24.Append(latinFont24);
            runProperties24.Append(eastAsianFont24);
            runProperties24.Append(complexScriptFont24);
            Drawing.Text text24 = new Drawing.Text();
            text24.Text = text;
            run21.Append(runProperties24);
            run21.Append(text24);
            paragraph25.Append(run21);

            if (isLastParagraph)
            {
                Drawing.EndParagraphRunProperties endParagraphRunProperties20 = new Drawing.EndParagraphRunProperties() { Language = "en-US", FontSize = 1400, Dirty = false };
                Drawing.LatinFont latinFont26 = new Drawing.LatinFont() { Typeface = "Verdana", PitchFamily = 34, CharacterSet = 0 };
                Drawing.EastAsianFont eastAsianFont26 = new Drawing.EastAsianFont() { Typeface = "Verdana", PitchFamily = 34, CharacterSet = 0 };
                Drawing.ComplexScriptFont complexScriptFont26 = new Drawing.ComplexScriptFont() { Typeface = "Verdana", PitchFamily = 34, CharacterSet = 0 };
                endParagraphRunProperties20.Append(latinFont26);
                endParagraphRunProperties20.Append(eastAsianFont26);
                endParagraphRunProperties20.Append(complexScriptFont26);
                paragraph25.Append(endParagraphRunProperties20);
            }
            return paragraph25;
        }
        public static void SwapPlaceholderText(SlidePart slidePart, string placeholder, string value)
        {
            List<Drawing.Text> textList = slidePart.Slide.Descendants<Drawing.Text>().Where(t => t.Text.Equals(placeholder)).ToList();
            foreach (Drawing.Text text in textList)
            {
                text.Text = value;
            }
        }
        public static SlidePart CloneSlidePart(PresentationPart presentationPart, SlidePart slideTemplate, int pos,uint maxSlideId)
        {
            //Create a new slide part in the presentation.
            SlidePart newSlidePart = presentationPart.AddNewPart<SlidePart>("newSlide" + pos);

            //Add the slide template content into the new slide.
            newSlidePart.FeedData(slideTemplate.GetStream());
            //Make sure the new slide references the proper slide layout.
            newSlidePart.AddPart(slideTemplate.SlideLayoutPart);
            //Get the list of slide ids.
            SlideIdList slideIdList = presentationPart.Presentation.SlideIdList;
            //Deternmine where to add the next slide (find max number of slides).
            SlideId prevSlideId = null;
            maxSlideId = 1;
            foreach (SlideId slideId in slideIdList.ChildElements)
            {
                if (slideId.Id > maxSlideId)
                {
                    maxSlideId = slideId.Id;
                    prevSlideId = slideId;
                }
            }
            maxSlideId++;
            //Add the new slide at the end of the deck.
            SlideId newSlideId = slideIdList.InsertAfter(new SlideId(), prevSlideId);
            //Make sure the id and relid are set appropriately.
            newSlideId.Id = maxSlideId;
            newSlideId.RelationshipId =presentationPart.GetIdOfPart(newSlidePart);
            return newSlidePart;
        }
        public static void SwapPhoto(SlidePart slidePart, List<string> imgId)
        {
            List<Drawing.Blip> blip = slidePart.Slide.Descendants<Drawing.Blip>().ToList();
            int k = 0;
            foreach (Drawing.Blip b in blip)
            {
                if (k < imgId.Count)
                {
                    b.Embed = imgId[k];
                    k++;
                }
            }
            slidePart.Slide.Save();
        }

        public static void DeleteTemplateSlide(PresentationPart presentationPart, SlidePart slideTemplate, SlideId sldid)
        {
            //Get the list of slide ids.
            SlideIdList slideIdList = presentationPart.Presentation.SlideIdList;
            //Delete the template slide reference.
            foreach (SlideId slideId in slideIdList.ChildElements)
            {
                if (slideId.RelationshipId.Value.Equals(sldid)) slideIdList.RemoveChild(slideId);
            }
            //Delete the template slide.
            slideIdList.RemoveChild(sldid);
            presentationPart.DeletePart(slideTemplate);
        }

        public static bool urlExists(string url)
        {
            HttpWebRequest req = (HttpWebRequest)WebRequest.Create(url);
            req.AllowAutoRedirect = false;
            try
            {
                HttpWebResponse res = (HttpWebResponse)req.GetResponse();

                if (res.StatusCode == HttpStatusCode.OK)
                    return true;
                else
                    return false;
            }
            catch
            {
                return false;
            }
        }

        #endregion Export PPTX

    }
}
